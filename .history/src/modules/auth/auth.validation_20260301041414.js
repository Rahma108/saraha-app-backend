
import joi from 'joi'
export const loginSchema = joi.object().keys({
    email : joi.string().email({minDomainSegments:2 , maxDomainSegments:3 , tlds:{allow:['com', 'edu' , 'net']}}).required(),
    password:joi.string().pattern(new RegExp(/^(?=.*[a-z]){1,}(?=.*[A-Z]){1,}(?=.*\d){1,}(?=.*\W){1,}[\w\W\d].{8,25}$/)),
}).required()

export const signupSchema = {

    body:loginSchema.append({
    userName : joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)).required(),
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
    phone:joi.string().trim().max(11).pattern(new RegExp(/^(002|02|\+2)?01[0-25]\d{8}$/)).required() ,
    gender:joi
}).required(),
    params:joi.object().keys({
        lang:joi.string().valid("ar" , "en").required()

    })
}

