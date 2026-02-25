import {Router} from 'express'
import { profile, rotateToken } from './user.service.js'
import { authentication, successResponse } from '../../common/utils/index.js'
import { TokenTypeEnum } from '../../common/enums/security.enum.js'

const router = Router() 
router.get('/' , authentication() , async (req , res , next )=>{
    
    const result = await profile(req.user)
    return successResponse({res , result})
})

router.get('/rotate' , authentication(TokenTypeEnum.refresh) , async (req , res , next )=>{
    
    const result = await rotateToken(req.user , `${req.protocol}://${req.host}`)
    return successResponse({res , result})
})
export default router
