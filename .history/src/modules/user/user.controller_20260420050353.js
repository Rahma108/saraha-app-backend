import {Router} from 'express'
import { coverPicture, logout, profile, profilePicture, removeProfilePicture, rotateToken, sharedProfile, updatePassword } from './user.service.js'
import { authentication, successResponse, validation } from '../../common/utils/index.js'
import { TokenTypeEnum } from '../../common/enums/security.enum.js'
import { authorization } from '../../common/utils/middleware/authorization.middleware.js'
import { endPoint } from './user.authorization.js'
import * as validators from './user.validation.js'
import { fieldValidation, upload } from '../../common/utils/multer.js'
import multer from 'multer'
import {resolve} from 'path'
const router = Router() 

router.get('/' , authentication() , authorization(endPoint.profile), async (req , res , next )=>{
    
    const result = await profile(req.user)
    return successResponse({res , result})
})
router.patch('/password' ,
    authentication() ,
    validation(validators.updatePasswordSchema)
    , async(req , res , next )=>{
    const credentials = await updatePassword(req.body , req.user ,`${req.protocol}://${req.host}` )
    return successResponse({res , result : {...credentials} } )
})
router.get('/:userId/shared-profile', validation(validators.shareProfile) , async (req , res , next )=>{
    
    const result = await sharedProfile(req.params.userId)
    return successResponse({res , result})
})

router.patch('/profile-picture' ,
    authentication()
    ,upload("user/image", [...fieldValidation.image], 10)
    .single("attachment"),
    validation(validators.profilePicture)
    , async(req , res , next )=>{
    const account = await profilePicture(req.file ,  req.user )
    return successResponse({res ,result:{account} })
})

router.delete('/remove-profile-picture' ,
    authentication()
    , async(req , res , next )=>{
    const account = await removeProfilePicture(  req.user )
    return successResponse({res ,result:{account} })
})

// router.patch('/cover-picture' ,
//     authentication()
//     ,upload("user/image/covers", [...fieldValidation.image], 10)
//     .fields([
//         {name:"coverProfilePicture" , maxCount:2}
//     ]),
//     validation(validators.coverPicture)
//     , async(req , res , next )=>{
//     const account = await coverPicture(req.files ,  req.user )
//     return successResponse({res ,result:{account} })
// })



router.patch('/cover-picture' ,
    authentication()
    ,upload("user/image/cover", [...fieldValidation.image], 10).array("coverProfilePicture" , 2),
    validation(validators.coverPicture)
    , async(req , res , next )=>{
    const account = await coverPicture(req.files, req.user);
    return successResponse({res ,result:{account} })
})
router.get('/rotate' , authentication(TokenTypeEnum.refresh) , async (req , res , next )=>{
    
    const result = await rotateToken(req.user , req.decoded ,`${req.protocol}://${req.host}`)
    return successResponse({res , result})
})

router.post('/logout', authentication() ,  async(req , res , next)=>{
    const status = await logout(req.body, req.user, req.decoded )
    return successResponse({res  , status:status  })
})
export default router
