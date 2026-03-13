
// logic--- queries ....

import { ClientID } from "../../../config/config.service.js"
import { ProviderEnum} from "../../common/enums/user.enum.js"
import { BadRequestException, ConflictException, NotFoundException } from "../../common/utils/response/index.js"
import { compareHash, generateHash  , encrypt , decrypt, createLoginCredentials} from "../../common/utils/security/index.js"
import { create, createOne, findOne } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"
import {OAuth2Client}from 'google-auth-library'
import { createNumberOtp, emailEmitter, emailTemplate, sendEmail } from "../../common/utils/index.js"
import { set , otpKey , get, otpBlockKey, otpMaxRequestKey, ttl, increment, deleteKeys, keys } from "../../common/services/redis.service.js"

export const generateAndSendConfirmEmailOtp = async(email)=>{
       //Check Block Conditional .
      const blockKey= otpBlockKey(email)
      const remainingBlockTime = await ttl(blockKey)
      if(remainingBlockTime>0){
          throw ConflictException({message:`You have reached Max Request Trial Count please try again later after ${remainingBlockTime} sec. `})
      }
      //check Max Request Trials 
      const maxTrialKey = otpMaxRequestKey(email)
        const checkOtpMaxRequest = Number(await get(maxTrialKey) || 0 )
        if(checkOtpMaxRequest>=3){
              await set({
              key:  blockKey , 
              value : 0
            , ttl:300 })
    
          throw ConflictException({message:"You have reached Max Request Trial Count please try again later after 300 sec. "})

        }
      const code = await createNumberOtp()
        await set({
          key: otpKey(email) , 
          value : await generateHash(code.toString())
        , ttl: 120
      })
      checkOtpMaxRequest  > 0 ? await increment(maxTrialKey): await set({key : maxTrialKey , value : 1 , ttl : 300 })
      emailEmitter.emit("Confirm_Email" , {to:email , subject:"Confirm_Email" ,code:code.toString() , title:"Confirm_Email"})
      return ;
}


export const signup =async (inputs)=>{
  const {userName , email ,  password , gender , phone , role  } = inputs 
  const checkEmailExists = await findOne({
    model:UserModel ,
    select :"email" ,
    filter:{email} ,
    options:{
      lean:true 
    }
  })

  if(checkEmailExists){
    throw  ConflictException({message:"Email Already Exists ‼️"})

  }
    const [user] = await create({ model:UserModel 
    , data : [{userName , email , password: await generateHash(password) , gender , phone : encrypt(phone) 
        , Provider: ProviderEnum.System  , role:role }] })
    // Send a verification code to email after registration
      await generateAndSendConfirmEmailOtp(email)
  return user
}
//Confirm Email with otp..
export const confirmEmail = async(inputs)=>{
  const {email , otp} = inputs
    const account = await findOne({
    model:UserModel ,
    select :"email" ,
    filter:{email , confirmEmail: { $eq: null } , Provider:ProviderEnum.System } 
  })
  if(!account){
    throw NotFoundException({message:"Fail to find Match account ❌"})
  }
  const hashOtp = await get(otpKey(email))
  if(!hashOtp){
    throw NotFoundException({message : "Expired OTP 😊"})
  }
  if(!await compareHash(otp , hashOtp )){
    throw ConflictException({message :"Invalid OTP ❌"})
  }
  account.confirmEmail = new Date()
  await account.save()


  await deleteKeys(await keys(otpKey(email)))
  return ;
}

export const reSendConfirmEmail = async(inputs)=>{
  const {email} = inputs
    const account = await findOne({
    model:UserModel ,
    select :"email" ,
    filter:{email , confirmEmail: { $eq: null } , Provider:ProviderEnum.System } 
  })
  if(!account){
    throw NotFoundException({message:"Fail to find Match account ❌"})
  }
  const remainingTime = await ttl(otpKey(email))
  if( remainingTime > 0 ){
    throw ConflictException({message : `Sorry We Can not provide new otp until exists one is expired ypu can try again after ${remainingTime}😊`})
  }
    // Re-Send a verification code to email after registration
  await generateAndSendConfirmEmailOtp(email)
  return ;
}

export const login = async(inputs , issuer )=>{
  const {email ,  password  } = inputs 
  const user = await findOne({
    model :UserModel ,
    filter:{email , Provider : ProviderEnum.System  , confirmEmail:{ $ne: null }}
  })
  if(!user){
    throw  NotFoundException({message:"Invalid Login Credentials ❌"})
  }
  user.phone = decrypt(user.phone)
      // Bcrypt.
      const match = await compareHash(password , user.password )
  if(!match){
        throw NotFoundException({message : "Invalid Login Credentials .❌"})
  }
      // Token 
      return await createLoginCredentials(user , issuer)
}    

const verifyGoogleAccount = async(idToken)=>{
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: ClientID , 
    });
    const payload = ticket.getPayload();
    console.log(payload);
    if(!payload?.email_verified){
      throw BadRequestException({message:"Fail to verify authenticated this account with google 🫠"})

    }
    return payload


}

export const loginWithGmail = async({idToken , issuer})=>{
  if (!idToken) {
    throw new BadRequestException({ message: "idToken is required" });
}
  const payload = await verifyGoogleAccount(idToken)
  const user = await findOne({model:UserModel , email:payload.email  , provider:ProviderEnum.Google })
  if(!user){
    throw NotFoundException({message : "Invalid Login Credentials ."})

  }

  return await createLoginCredentials(user, issuer) 
}


export const signupWithGmail = async({idToken , issuer})=>{
  if (!idToken) {
    throw new BadRequestException({ message: "idToken is required" });
}
const payload = await verifyGoogleAccount(idToken)

//  1- User Exists in Database  And Provider == System  ==> Throw Error ..
//  2- User Exists in Database  And Provider == Google  ==> Redirect google Login 
//  3- User Not Exists ==> Create with Provider Google .

  const checkUserExist = await findOne({model:UserModel , email:payload.email })
  if(checkUserExist){
    // 1- User Exists in Database  And Provider == System  ==> Throw Error ..
    if(checkUserExist.provider == ProviderEnum.System){
    throw ConflictException({message:"Account Already Exist With Different Provider ‼️"})

  }
  // 2- User Exists in Database  And Provider == Google  ==> Redirect google Login 
  // const result = await loginWithGmail({idToken} , issuer )

  // return {result , status:200 }
    const token = await createLoginCredentials(checkUserExist, issuer);
    return { account: token, status: 200 };

  }

  //  3- User Not Exists ==> Create with Provider Google .
  // New user → create + login
  const newUser = await createOne({
    model: UserModel,
    data: {
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      email: payload.email,
      provider: ProviderEnum.Google,
      profilePicture: payload.picture,
      confirmEmail: new Date()
    }
  });

  const token = await createLoginCredentials(newUser, issuer);
  return { account: token , status: 201 };

  //token

}

