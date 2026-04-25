import joi from 'joi'
import { generalValidationFields } from '../../common/validation.js';
import { fieldValidation } from '../../common/utils/multer.js';
export const shareProfile = {
    params:joi.object().keys({
        userId:generalValidationFields.id.required()

    }).required()
}


export const updatePasswordSchema= {
    body:joi.object().keys({
        oldPassword:generalValidationFields.password.required(),
        password:generalValidationFields.password.not(joi.ref("oldPassword")).required(),
        confirmPassword:generalValidationFields.confirmPassword("password").required(),

    }).required()
}

export const editProfileSchema = {
    body:joi.object().keys({
        bio :generalValidationFields.bio.optional(),
        firstName :generalValidationFields.firstName.optional(),
        lastName:generalValidationFields.lastName.optional(),

    }).required()
}

export const profilePicture ={
    file:generalValidationFields.file(fieldValidation.image).required()
}

export const coverPicture ={
    files:joi.array().items(generalValidationFields.file(fieldValidation.image).required()).min(1).max(2).required()

}

export const profileAttachment ={
    files:joi.object().keys({
        profilePicture:joi.array().items(generalValidationFields.file(fieldValidation.image).required()).length(1).required(),
        coverProfilePicture:joi.array().items(generalValidationFields.file(fieldValidation.image).required()).min(1).max(2).optional(),
    }).required()
}

