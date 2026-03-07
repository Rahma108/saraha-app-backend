
import { forbiddenException } from "../response/error.response.js"
export const authorization =  ( accessRoles = [] )=>{
    return async  (req , res , next )=>{
            if(!accessRoles.includes(req.user.role)){
                throw forbiddenException({message : "Not allowed account !"})
            }
            
            next()
        

    }
}