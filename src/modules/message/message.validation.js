import joi from 'joi'
import { generalValidationFields } from '../../common/validation.js'
import { fieldValidation } from '../../common/utils/multer.js'
export const sendMessageSchema = {
    params:joi.object().keys({
        receiverId:generalValidationFields.id.required()
    }).required(),
    body:joi.object().keys({
        content:joi.string().min(2).max(10000)
    }),
    file:joi.array().items(generalValidationFields.file(fieldValidation.image)).max(2)


}
export const getMessageSchema = {
    params:joi.object().keys({
        messageId:generalValidationFields.id.required()
    }).required(),

}