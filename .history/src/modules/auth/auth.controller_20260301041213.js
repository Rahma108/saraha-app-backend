
import {Router} from 'express'
import { login, signup } from './auth.service.js'
import { successResponse } from '../../common/utils/index.js'
const router = Router() // app
router.post('/signup' validation(validators.signupSchema) , async(req , res , next )=>{
    const result = await signup(req.body)
    return  successResponse({res , status:201 , result})

})

router.post('/login' , async(req , res , next )=>{
    const result = await login(req.body , `${req.protocol}://${req.host}`)
    return successResponse({res ,  result})
})

export default router
