import {Router} from 'express'
import { profile, profilePicture, rotateToken, sharedProfile } from './user.service.js'
import { authentication, successResponse, validation } from '../../common/utils/index.js'
import { TokenTypeEnum } from '../../common/enums/security.enum.js'
import { authorization } from '../../common/utils/middleware/authorization.middleware.js'
import { endPoint } from './user.authorization.js'
import * as validators from './user.validation.js'
import { upload } from '../../common/utils/multer.js'
const router = Router() 

router.get('/' , authentication() , authorization(endPoint.profile), async (req , res , next )=>{
    
    const result = await profile(req.user)
    return successResponse({res , result})
})
router.get('/:userId/shared-profile', validation(validators.shareProfile) , async (req , res , next )=>{
    
    const result = await sharedProfile(req.params.userId)
    return successResponse({res , result})
})

router.patch('/profile-picture' ,
    authentication()
    ,upload("user/image").single("image") , async(req , res , next )=>{
           console.log(req.file);
    const account = await profilePicture(req.file ,  req.user )
    return successResponse({res ,result:{account} })
})

router.get('/rotate' , authentication(TokenTypeEnum.refresh) , async (req , res , next )=>{
    
    const result = await rotateToken(req.user , `${req.protocol}://${req.host}`)
    return successResponse({res , result})
})
export default router
