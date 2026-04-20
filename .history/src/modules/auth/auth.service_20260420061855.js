
// logic--- queries ....

import { ClientID } from "../../../config/config.service.js"
import { ProviderEnum} from "../../common/enums/user.enum.js"
import { BadRequestException, ConflictException, NotFoundException } from "../../common/utils/response/index.js"
import { compareHash, generateHash  , encrypt , decrypt, createLoginCredentials} from "../../common/utils/security/index.js"
import { create, createOne, findOne, findOneAndUpdate } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"
import {OAuth2Client}from 'google-auth-library'
import { createNumberOtp, emailEmitter, emailTemplate, sendEmail } from "../../common/utils/index.js"
import { set , otpKey , get, otpBlockKey, otpMaxRequestKey, ttl, increment, deleteKeys, keys, revokeTokenKey, baseRevokeTokenKey } from "../../common/services/redis.service.js"
import { EmailEnum } from "../../common/enums/index.js"

export const verifyEmailOtp = async({ email , subject=EmailEnum.ConfirmEmail , title = "Verify Account" }={} )=>{
       //Check Block Conditional .
      const blockKey= otpBlockKey({email , type:subject })
      const remainingBlockTime = await ttl(blockKey)
      if(remainingBlockTime>0){
          throw ConflictException({message:`You have reached Max Request Trial Count please try again later after ${remainingBlockTime} sec. `})
      }

      const oldCodeTTL = await ttl(otpKey({email , type:subject}))
      if(oldCodeTTL > 0 ){
          throw ConflictException({message:`Sorry we can not send new otp until first one get expired please try again after ${oldCodeTTL} `})

      }
      //check Max Request Trials 
      const maxTrialKey = otpMaxRequestKey({email , type:subject })
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
          key: otpKey({email , type:subject }) , 
          value : await generateHash(code.toString())
        , ttl: 120
      })
        await sendEmail({
            to:email ,
            subject,
            html:emailTemplate({code , title })
        })
      checkOtpMaxRequest  > 0 ? await increment(maxTrialKey): await set({key : maxTrialKey , value : 1 , ttl : 300 })
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
      emailEmitter.emit("sendEmail" ,async ()=>{
          await verifyEmailOtp({email })
      })
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
  const hashOtp = await get(otpKey({email}))
  if(!hashOtp){
    throw NotFoundException({message : "Expired OTP 😊"})
  }
  if(!await compareHash(otp , hashOtp )){
    throw ConflictException({message :"Invalid OTP ❌"})
  }
  account.confirmEmail = new Date()
  await account.save()


  await deleteKeys(await keys(otpKey({email })))
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
    // Re-Send a verification code to email after registration
  await verifyEmailOtp({email})
  return ;
}
// Forget Password ...
// 1- Request Code ..
// 2- Verify Code ...
// 3- Update Code ..

export const requestForgotPasswordCode = async({email})=>{
    const account = await findOne({
    model:UserModel ,
    select :"email" ,
    filter:{email , confirmEmail:{ $ne: null } , Provider:ProviderEnum.System } 
  })
  if(!account){
    throw NotFoundException({message:"Fail to find Match account ❌"})
  }
  emailEmitter.emit("sendEmail" ,async ()=>{
          await verifyEmailOtp({email , subject:EmailEnum.ForgotPassword })
      })
  return ;
}

export const verifyForgotPasswordCode = async({email , otp })=>{
  const hashOtp = await get(otpKey({email , type:EmailEnum.ForgotPassword }))
  if(!hashOtp){
    throw NotFoundException({message : "Expired OTP ❌"})
  }
  if(!await compareHash(otp , hashOtp )){
      throw ConflictException({message:"Invalid OTP 😊"})
  }
  return ;
}

export const resendForgotPasswordCode= async({email , otp , password })=>{
    await verifyForgotPasswordCode({email ,otp })
    const account = await findOneAndUpdate({
      model:UserModel ,
      filter :{email , confirmEmail:{ $ne: null } , Provider:ProviderEnum.System } ,
      update:{
        password:await generateHash(password),
        changeCredentialTime:new Date() // All Logout
      }

    })
    if(!account){
      throw NotFoundException({message:"Fail to find Match account ❌"})
    }
    Promise.allSettled([
          deleteKeys(await keys((otpKey({email , type:EmailEnum.ForgotPassword })))),
          deleteKeys(await keys(baseRevokeTokenKey(account._id.toString())))
    ])
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
  if (user.phone) {
    user.phone = decrypt(user.phone);
}
      // Bcrypt.
      const match = await compareHash(password , user.password )
  if(!match){
        throw NotFoundException({message : "Invalid Login Credentials .❌"})
  }
  // Freeze Account
      if (user.isDeleted) {
          user.isDeleted = null;
          await user.save();
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

