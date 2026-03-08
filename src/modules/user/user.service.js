import fs from 'fs'
import { resolve } from 'node:path';
import { createLoginCredentials} from "../../common/utils/security/token.security.js";
import {findOne, updateOne, UserModel } from "../../DB/index.js";
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from '../../../config/config.service.js';
import { LogoutEnum } from '../../common/enums/security.enum.js';
import {baseRevokeTokenKey, deleteKeys, keys, revokeTokenKey, set} from '../../common/services/index.js'
import { ConflictException } from '../../common/utils/index.js';

// Access .......................................
export const profile= async  (user)=>{
    user.phone = decrypt(user.phone)
    return user
}


export const sharedProfile= async  (userId)=>{
    
    const profile = await findOne({
        model:UserModel ,
        filter:{_id:userId},
        select:"firstName lastName userName email phone profilePicture"

    })
    if(profile.phone){
      profile.phone = decrypt(profile.phone)
    }
    // Assignment تسجيل عدد الالزيارات على ال profile بتاعى ..
    // بخزن ف ال database فقط
    await updateOne({
        model:UserModel ,
        filter:{_id: userId },
        update:{ $inc: { visitCount: 1 } }

    })
    return profile
}

export const profilePicture = async(file , user )=>{
    if(user.profilePicture){
        const oldPath = resolve(user.profilePicture);
        if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    user.profilePicture = file.finalPath
    await user.save();
    return user;
}

export const coverPicture = async(files , user )=>{
    if(files.coverProfilePicture){
        user.coverProfilePicture = files.coverProfilePicture.map(file => file.finalPath)
    }
    await user.save()
    return user
}
// refresh ........................................
export const createRevokeToken = async( { userId ,jti , ttl  })=>{
    await set({
                key: revokeTokenKey({userId, jti}),
                value : jti ,
                ttl 
            })
    return ;
}

export const rotateToken = async  (user , {iat , jti , subject } , issuer)=>{
    if((iat+ ACCESS_EXPIRES_IN )* 1000 >= Date.now() + (30000)  ){
        throw ConflictException({message: "Current access token still valid "})
    }
    await createRevokeToken({userId:subject , jti , ttl:iat  + REFRESH_EXPIRES_IN })
    return await createLoginCredentials(user , issuer )
}

export const logout = async({flag}, user , {jti , iat , subject} )=>{
    let status = 200
    switch (flag) {
        case LogoutEnum.All:
            user.changeCredentialTime= new Date(Date.now()) 
            await user.save()

            await deleteKeys(await keys(baseRevokeTokenKey(subject)))
            break;
    
        default:
            await createRevokeToken({userId:subject , jti , ttl:iat  + REFRESH_EXPIRES_IN })
            status=201
            break;
        }
    return status
}
