// logic
import { Types } from "mongoose";
import { decrypt } from "../../common/utils/index.js";
import { createLoginCredentials} from "../../common/utils/security/token.security.js";
import { findOne, updateOne, UserModel } from "../../DB/index.js";


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

    user.profilePicture = file.finalPath
    await user.save()
    return user
}


// refresh ........................................


export const rotateToken = async  (user, issuer)=>{
    return await createLoginCredentials(user , issuer )
}

