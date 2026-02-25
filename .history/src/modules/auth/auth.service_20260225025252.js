
// logic--- queries ....

import { System_REFRESH_TOKEN_SECRET_KEY, System_TOKEN_SECRET_KEY, User_REFRESH_TOKEN_SECRET_KEY, User_TOKEN_SECRET_KEY} from "../../../config/config.service.js"
import { ProviderEnum, RoleEnum } from "../../common/enums/user.enum.js"
import { ConflictException, NotFoundException } from "../../common/utils/response/index.js"
import { compareHash, generateHash  , encrypt , decrypt} from "../../common/utils/security/index.js"
import { create, findOne } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"

import jwt from 'jsonwebtoken'

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
   // Password   Argon2 
      // const match = await compareHash(password , user.password , 'argon2' )
      // Bcrypt ...
      const match = await compareHash(password , user.password )
  if(!match){
        throw NotFoundException({message : "Invalid Login Credentials .❌"})
  }
  let signature = undefined
  let refreshSignature = undefined
  let audience = 'User'
  let  refreshAudience  = 'User'

  switch (user.role) {
    case RoleEnum.Admin:
      signature = System_TOKEN_SECRET_KEY
      refreshSignature = System_REFRESH_TOKEN_SECRET_KEY
      refreshAudience = 'Refresh_System'
      audience = 'System'
      break;
    default:
      signature = User_TOKEN_SECRET_KEY
      refreshSignature = User_REFRESH_TOKEN_SECRET_KEY
      refreshAudience = 'Refresh_User'
      audience = 'User'
      break;
  }

  // Token .....
  // sign(Payload   ,   password   , options ) 
  // payload === options '
  // الاتنين مع بعض مينفعش ..


  // تتخزن ف ال local storage ...
  const access_token = jwt.sign({} ,signature,
    {
      subject:user._id.toString() ,
      noTimestamp:true , 
      // notBefore:60 * 60  , // Active only after .. sec from time creation .
      expiresIn:  30 * 60 , // sec .. // end after 60 * 30 sec...
      // issuer:'localhost:3000' ,
      issuer , // dynamic ..
      // audience : ['web' , 'mobile']
      audience ,
    }
  )

    const refresh_token = jwt.sign({} ,refreshSignature,
    {
      subject:user._id.toString() ,
      noTimestamp:true , 
      expiresIn:  '1y' , // end after 1 year ..
      issuer , // dynamic ..
      audience : refreshAudience ,
    }
  )
  // user.phone = decrypt(user.phone)
  return {access_token , refresh_token } 
}    