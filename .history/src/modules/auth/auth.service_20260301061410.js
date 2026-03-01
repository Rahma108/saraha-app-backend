
// logic--- queries ....

import { ProviderEnum} from "../../common/enums/user.enum.js"
import { ConflictException, NotFoundException } from "../../common/utils/response/index.js"
import { compareHash, generateHash  , encrypt , decrypt, createLoginCredentials} from "../../common/utils/security/index.js"
import { create, findOne } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"

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



