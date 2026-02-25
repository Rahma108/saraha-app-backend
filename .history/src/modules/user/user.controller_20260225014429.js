
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

export default router