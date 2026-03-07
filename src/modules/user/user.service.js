import fs from 'fs'
import { resolve } from 'node:path';
import { createLoginCredentials} from "../../common/utils/security/token.security.js";
import { createOne, deleteMany, findOne, updateOne, UserModel } from "../../DB/index.js";
import { TokenModel } from '../../DB/model/index.js';
import { REFRESH_EXPIRES_IN } from '../../../config/config.service.js';
import { LogoutEnum } from '../../common/enums/security.enum.js';


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


export const rotateToken = async  (user, issuer)=>{
    return await createLoginCredentials(user , issuer )
}

export const logout = async({flag}, user , decoded  )=>{
    let status = 200
    switch (flag) {
        case LogoutEnum.All:
            user.changeCredentialTime= new Date(Date.now()) 
            await user.save()

            await deleteMany({model:TokenModel , userId : user._id})
            break;
    
        default:
            await createOne({
                model:TokenModel,
                data:{
                    userId : decoded.subject ,
                    jwtid:decoded.jti ,
                    expiresIn:new Date((decoded.iat + REFRESH_EXPIRES_IN)* 1000)
                }
            } )
            status=201
            break;
        }
    return status
}
