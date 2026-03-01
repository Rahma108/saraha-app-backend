
import joi from 'joi'

export const loginSchema = {

    bod
}

export const signupSchema = {

    body:loginSchema.append({
    userName : joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)).required(),
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
    phone:joi.string().trim().max(11).pattern(new RegExp(/^(002|02|\+2)?01[0-25]\d{8}$/)).required() ,
    gender:joi.number().required()
}).required(),
    // params:joi.object().keys({
    //     lang:joi.string().valid("ar" , "en").required()

    // })
}

