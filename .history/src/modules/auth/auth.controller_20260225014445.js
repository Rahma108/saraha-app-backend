
import {Router} from 'express'
import { login, signup } from './auth.service.js'
import { successResponse } from '../../common/utils/index.js'
const router = Router() // app


router.post('/signup' , async(req , res , next )=>{
    const result = await signup(req.body)
    return  successResponse({res , status:201 , result})

})

router.post('/login' , async(req , res , next )=>{
    console.log(req.protocol) // http .
    console.log(req.host);
     console.log(`${req.protocol}://${req.host}`);
    
    const result = await login(req.body , `${req.protocol}://${req.host}`)
    return successResponse({res ,  result})
})

export default router


>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
