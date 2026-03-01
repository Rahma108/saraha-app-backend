
// logic--- queries ....

import { ClientID } from "../../../config/config.service.js"
import { ProviderEnum} from "../../common/enums/user.enum.js"
import { ConflictException, NotFoundException } from "../../common/utils/response/index.js"
import { compareHash, generateHash  , encrypt , decrypt, createLoginCredentials} from "../../common/utils/security/index.js"
import { create, findOne } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"
import {OAuth2Client}from 'google-auth-library'
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
  return user
}
export const login = async(inputs , issuer )=>{
  const {email ,  password  } = inputs 
  const user = await findOne({
    model :UserModel ,
    filter:{email , Provider : ProviderEnum.System }
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
      throw BadRequestException({message:"Fail to verify authenticated this account with google"})

    }
    return payload


}

export const loginWithGmail = async({idToken , issuer})=>{
  const payload = await verifyGoogleAccount(idToken)
  const user = await findOne({model:UserModel , email:payload.email  , provider:ProviderEnum.Google })
  if(!user){
    throw NotFoundException({message : "Invalid Login Credentials ."})

  }

  return await createLoginCredentials(user, issuer) 
}


export const signupWithGmail = async({idToken , issuer})=>{
const payload = await verifyGoogleAccount(idToken)
  const checkUserExist = await findOne({model:UserModel , email:payload.email })
  if(checkUserExist){
    if(checkUserExist.provider == ProviderEnum.System){
    throw ConflictException({message:"Account Already Exist With Different Provider ‼️"})

  }
  // Return Login With Gmail
  // const result = await loginWithGmail({idToken} , issuer )

  // return {result , status:200 }
    const token = await createLoginCredentials(existingUser, issuer);
    return { account: token, status: 200 };

  }
  // New user → create + login
  const newUser = await create({
    model: UserModel,
    data: {
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      provider: ProviderEnum.Google,
      profilePicture: payload.picture,
      confirmEmail: new Date()
    }
  });

  const token = await createLoginCredentials(newUser, issuer);
  return { account: token, status: 201 };

}

