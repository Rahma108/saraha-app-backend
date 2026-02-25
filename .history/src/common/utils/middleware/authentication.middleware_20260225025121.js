import { TokenTypeEnum } from "../../enums/security.enum.js"
import { BadRequestException } from "../response/error.response.js"
import { decodeToken } from "../security/token.security.js"


export const authentication =  ( tokenType = TokenTypeEnum.access )=>{
    return async  (req , res , next )=>{
        if(!req?.headers?.authorization){
            throw BadRequestException({message : "Missing authorization key "})
        }
            req.user=  await decodeToken({token : req.headers?.authorization  , tokenType })

            next()
        

    }



}