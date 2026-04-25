import {Router} from 'express'
import {authentication, BadRequestException, decodeToken, fieldValidation, successResponse, upload, validation } from '../../common/utils/index.js'
import { deleteById, getAllMessages, getFavouriteMessages, getMessageById, sendMessage, toggleFavourite } from './message.service.js'
import * as validators from './message.validation.js'
import { TokenTypeEnum } from '../../common/enums/security.enum.js'
const router= Router()
// router.post('/:receiverId' ,
//     async(req , res , next)=>{
//         if(req.headers?.authorization){
//             const {user , decoded}=  await decodeToken({token :req.headers.authorization.split(" ")[1], tokenType:TokenTypeEnum.access })
//             req.user = user
//             req.decoded= decoded

//         }
//             next()
//     },
//     upload({customPath:"message" , validation:[...fieldValidation.image , ...fieldValidation.files], maxSize : 1 }).array("attachments" , 2),
//     validation(validators.sendMessageSchema),
//         async(req , res , next)=>{
//         if (!req.body?.content && !req.files) {
//             throw BadRequestException({message :"Validation Error" , extra :[{message:"At least one key is required from [content , attachments]"}]})
//         }
//     const message = await sendMessage(req.params.receiverId , req.files , req.body)
//     return successResponse({res , status: 201 , result:{message} })

// })

router.post(
    "/:receiverId",
    async (req, res, next) => {
        try {
        if (req.headers?.authorization) {
            const { user, decoded } = await decodeToken({
            token: req.headers.authorization.split(" ")[1],
            tokenType: TokenTypeEnum.access,
            });
            req.user = user;
            req.decoded = decoded;
        } else {
            req.user = null;// anonymous
        }
        next();
        } catch (error) {
        req.user = null; //  token غلط — anonymous
        next();
        }
    },
    upload({
        customPath: "message",
        validation: [...fieldValidation.image, ...fieldValidation.files],
        maxSize: 1,
    }).array("attachments", 2),
    validation(validators.sendMessageSchema),
    async (req, res, next) => {
        try {
        if (!req.body?.content && !req.files) {
            throw BadRequestException({
            message: "Validation Error",
            extra: [
                {
                message: "At least one key is required from [content , attachments]",
                },
            ],
            });
        }

        const message = await sendMessage(
            req.params.receiverId,
            req.files,
            req.body,
            req.user || null 
        );

        return successResponse({ res, status: 201, result: { message } });
        } catch (error) {
        next(error);
        }
    }
);
router.get('/favourites',
    authentication(),
    async(req, res, next) => {
        const message = await getFavouriteMessages(req.user);
        return successResponse({ res, result: { message } });
    }
);

router.get('/list' ,
    authentication(),
        async(req , res , next)=>{
    const message = await getAllMessages( req.user)
    return successResponse({res , result:{message} })

})
router.get('/:messageId' ,
    authentication(),
    validation(validators.getMessageSchema),
        async(req , res , next)=>{
    const message = await getMessageById(req.params.messageId , req.user)
    return successResponse({res , result:{message} })

})


router.delete('/:messageId' ,
    authentication(),
    validation(validators.getMessageSchema),
        async(req , res , next)=>{
    const message = await deleteById(req.params.messageId , req.user)
    return successResponse({res , result:{message} })

})



router.patch('/favourite/:messageId',
    authentication(),
    validation(validators.getMessageSchema),
    async(req, res, next) => {
        const message = await toggleFavourite(req.params.messageId, req.user);
        return successResponse({ res, result: { message } });
    }
);



export default router