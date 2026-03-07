import joi from'joi'
import { Types } from 'mongoose'

export const generalValidationFields ={
    userName : joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)),
    email : joi.string().email({minDomainSegments:2 , maxDomainSegments:3 , tlds:{allow:['com', 'edu' , 'net']}}),
    password:joi.string().pattern(new RegExp(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*\d){1,}(?=.*\W){1,}[\w\W\d].{8,25}$/)),
    confirmPassword:(matchedPath)=>{
        return joi.string().valid(joi.ref(matchedPath))
    },
    phone:joi.string().trim().max(11).pattern(new RegExp(/^(002|02|\+2)?01[0-25]\d{8}$/)),
    id:joi.string().custom( (value , helper)=>{
                return Types.ObjectId.isValid(value)? true:helper.message("Invalid ObjectId .")
    
            }),
    file:function(mimetype=[]){
        return joi.object().keys(
                {
                fieldname: joi.string(),
                originalname: joi.string(),
                encoding: joi.string(),
                mimetype:  joi.string().valid(...mimetype),
                finalPath:joi.string().required(),
                destination: joi.string(),
                filename:joi.string(),   
                path: joi.string(),
                size: joi.number().positive()
                }
        )

    }

}