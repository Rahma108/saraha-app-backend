import fs from 'fs'
import path, { resolve } from 'node:path';
import { createLoginCredentials} from "../../common/utils/security/token.security.js";
import {findOne, updateOne, UserModel } from "../../DB/index.js";
import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from '../../../config/config.service.js';
import { LogoutEnum } from '../../common/enums/security.enum.js';
import {baseRevokeTokenKey, deleteKeys, keys, revokeTokenKey, set} from '../../common/services/index.js'
import { BadRequestException, compareHash, ConflictException, decrypt, generateHash, NotFoundException } from '../../common/utils/index.js';

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

export const updatePassword= async  ({oldPassword , password} , user , issuer )=>{
    if (!await compareHash(oldPassword , user.password )) {
        throw ConflictException({message:"Invalid Old Password ❌"})
    }
    for (const hash of user.oldPasswords || [] ) {
        if (await compareHash(password , hash )) {
        throw ConflictException({message:"Sorry This Password Is Weak you have already used it before ‼️"})
    }
    }
    user.oldPasswords.push(user.password)
    user.password = await generateHash(password)
    user.changeCredentialTime = new Date() // Logout ..
    await user.save()
    await deleteKeys(await keys(baseRevokeTokenKey(user._id)))

    return await createLoginCredentials(user , issuer)
}

export const profilePicture = async(file , user )=>{
    //Upload Profile Picture API
    if (user.profilePicture) {
        const oldPath = resolve(`./upload/general/${user.profilePicture}`);
        console.log("Deleting:", oldPath);

        console.log("DB VALUE:", user.profilePicture);
        console.log("FINAL PATH:", resolve(`./upload/general/${user.profilePicture}`));
        if (fs.existsSync(oldPath)) { 
            fs.unlinkSync(oldPath); 
        }

        user.gallery = user.gallery || [];
        user.gallery.push(user.profilePicture);

}
        // user.profilePicture = file.finalPath;
        user.profilePicture = file.filename;
        await user.save();

    return user;
}


export const removeProfilePicture = async(user )=>{
    //Upload Profile Picture API
    if (!user.profilePicture) {
        throw NotFoundException("Profile Picture is Not Found ❌")
}
    const path = resolve(`./upload/general/${user.profilePicture}`);
    if (fs.existsSync(path)) { 
            fs.unlinkSync(path); 
        }
        // user.profilePicture = file.finalPath;
        user.profilePicture = null
        await user.save();

    return user;
}

export const coverPicture = async(files , user )=>{
    // Cover Picture Upload Validation
    const existingCount = user.coverProfilePicture ? user.coverProfilePicture.length : 0;
    const newCount = files.coverProfilePicture ? files.coverProfilePicture.length : 0;

    const totalImages = existingCount + newCount;

    if (totalImages !== 2) {
        throw new Error("Total cover images must be exactly 2");
    }

    const newPaths = files.coverProfilePicture.map(file => file.finalPath)
    // if(files.coverProfilePicture){
    //     user.coverProfilePicture = files.coverProfilePicture.map(file => file.finalPath)
    // }
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
