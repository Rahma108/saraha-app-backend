
import {Router} from 'express'
import { profile, RotateToken } from './user.service.js'
import { successResponse } from '../../common/utils/index.js'

const router = Router() // app
router.get('/' , async (req , res , next )=>{
    const result = await profile(req.headers.authorization )
    return successResponse({res , result})
})

router.get('/rotate-token' , async (req , res , next )=>{
    const result = await RotateToken(req.headers.authorization )
    return successResponse({res , result})
})
>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
export default router