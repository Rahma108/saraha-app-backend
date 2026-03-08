
import joi from 'joi'
import { generalValidationFields } from '../../common/validation.js';
export const loginSchema = {
    body:joi.object().keys({
    email : generalValidationFields.email.required(),
    password:generalValidationFields.password.required(),
}).required()

}
export const signupSchema = {

    body:loginSchema.body.append({
    userName :generalValidationFields.userName.required(),
    confirmPassword:generalValidationFields.confirmPassword('password').required(),
    phone:generalValidationFields.phone.required() ,
    gender:joi.number().required()
}).required()
}

export const confirmEmailSchema = {

    body:joi.object().keys({
    email:generalValidationFields.email.required(),
    otp:generalValidationFields.otp.required()
}).required()
}
export const googleSignupSchema = {
    body: joi.object().keys({
        idToken: joi.string().required() 
    }).required()
}


export const googleLoginSchema = {
  body: joi.object().keys({
    idToken: joi.string().required() 
  }).required()
};