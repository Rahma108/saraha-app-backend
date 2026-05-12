// Start Assignment week ...

import jwt from 'jsonwebtoken'
import { RoleEnum } from '../../enums/user.enum.js'
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN, System_REFRESH_TOKEN_SECURITY_KEY, System_TOKEN_SECURITY_KEY, User_REFRESH_TOKEN_SECURITY_KEY , User_TOKEN_SECURITY_KEY } from '../../../../config/config.service.js'
import { AudienceEnum, TokenTypeEnum } from '../../enums/security.enum.js'
import { BadRequestException, UnauthorizedException } from '../response/error.response.js'
import { findOne } from '../../../DB/database.repository.js'
import { UserModel } from '../../../DB/index.js'
import {randomUUID} from 'node:crypto'
import { get, revokeTokenKey } from '../../services/redis.service.js'

// jwt.sign({payload , signature , options })
export const generateToken = async ({payload = {} , secretKey = User_TOKEN_SECURITY_KEY , options = {}  })=>{
    return  jwt.sign(payload , secretKey , options )
}


export const verifyToken = async ({token , secretKey = User_TOKEN_SECURITY_KEY  } = {} )=>{
    return  jwt.verify(token ,  secretKey )
}
export const getTokenSignature = async(role)=>{
                let accessSignature = undefined
                    let refreshSignature = undefined
                    let audience = AudienceEnum.User
                    switch (role) {
                        case RoleEnum.Admin:
                        accessSignature = System_TOKEN_SECURITY_KEY
                        refreshSignature  = System_REFRESH_TOKEN_SECURITY_KEY
                        audience = AudienceEnum.System
                        break;
                        default:
                        accessSignature = User_TOKEN_SECURITY_KEY
                        refreshSignature = User_REFRESH_TOKEN_SECURITY_KEY
                        audience = AudienceEnum.User
                        break;
                    } 
                    return {accessSignature , refreshSignature , audience }

}

export const getTokenSignatureLevel = async(audienceType)=>{
            let signatureLevel = RoleEnum.User 
                    switch (audienceType) {
                        case AudienceEnum.System:
                            signatureLevel = RoleEnum.Admin
                        break;
                        default:
                            signatureLevel = RoleEnum.User
                        break;
                    } 
                    return signatureLevel

}
export const createLoginCredentials = async(user , issuer )=>{
    if (typeof issuer !== 'string') {
    throw new Error(`Issuer must be string, got: ${typeof issuer}`);
}
    const {accessSignature , refreshSignature , audience } = await getTokenSignature(user.role)
    const jwtId = randomUUID()
    const access_token =  await generateToken({
        payload : {subject:user._id.toString() } , 
        secretKey:accessSignature , 
        options : {
            issuer : issuer , 
            audience : [TokenTypeEnum.access, audience  ] ,
            expiresIn : ACCESS_EXPIRES_IN,
            jwtid:jwtId
        }

    })
        const refresh_token =  await generateToken({
            payload : {subject:user._id.toString() } , 
            secretKey:refreshSignature , 
            options :{
            issuer , 
            audience : [TokenTypeEnum.refresh , audience] ,
            expiresIn:REFRESH_EXPIRES_IN,
            jwtid:jwtId
            }

        })


        return {access_token , refresh_token }
}

export const decodeToken = async ({ token, tokenType = TokenTypeEnum.access } = {}) => {

    if (!token) {
        throw BadRequestException({ message: "Token is required" });
    }

    const decoded = jwt.decode(token);

    if (!decoded) {
        throw UnauthorizedException({ message: "Invalid token format" });
    }

    if (!decoded?.aud || !Array.isArray(decoded.aud)) {
        throw BadRequestException({ message: "Invalid token payload (aud missing)" });
    }

    const [decodeTokenType, audienceType] = decoded.aud;

    if (decodeTokenType !== tokenType) {
        throw BadRequestException({
            message: `Invalid Token Type ${decodeTokenType}`
        });
    }

    const signatureLevel = await getTokenSignatureLevel(audienceType);
    const { accessSignature, refreshSignature } = await getTokenSignature(signatureLevel);

    const verifiedData = await verifyToken({
        token,
        secretKey: tokenType === TokenTypeEnum.refresh
            ? refreshSignature
            : accessSignature
    });

    if (!verifiedData?.subject) {
        throw UnauthorizedException({ message: "Invalid token subject" });
    }

    const user = await findOne({
        model: UserModel,
        filter: { _id: verifiedData.subject }
    });

    if (!user) {
        throw UnauthorizedException({ message: "User not found" });
    }

    if (
        user.changeCredentialTime &&
        user.changeCredentialTime.getTime() > decoded.iat * 1000
    ) {
        throw UnauthorizedException({ message: "Invalid Login Session ❌" });
    }

    return { user, decoded };
};
