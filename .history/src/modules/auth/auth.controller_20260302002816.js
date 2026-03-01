
import {Router} from 'express'
import { login, loginWithGmail, signup, signupWithGmail } from './auth.service.js'
import { successResponse, validation } from '../../common/utils/index.js'
import * as validators from './auth.validation.js'
const router = Router() // app
router.post('/signup' ,validation(validators.signupSchema) , async(req , res , next )=>{
    const result = await signup(req.body)
    return  successResponse({res , status:201 , result})

})

router.post('/login' , validation(validators.loginSchema), async(req , res , next )=>{

    const result = await login(req.body , `${req.protocol}://${req.host}`)
    return successResponse({res ,  result})
})
router.post('/signup/gmail' , async(req , res , next )=>{
    
    const issuer = `${req.protocol}://${req.get('host') || 'localhost:3000'}`;
    console.log("ISSUER:", issuer); // لازم يطلع شيء مثل http://localhost:3000
    const { account, status=201 } = await signupWithGmail(req.body ,issuer )
    return successResponse({ res , status,  result:{account}})
})
router.post('/login/gmail' , async(req , res , next )=>{
    console.log(req.body);
    const issuer = `${req.protocol}://${req.get('host') || 'localhost:3000'}`;
    const account = await loginWithGmail(req.body , issuer )
    return successResponse({ res ,  result:{account}})
})

export default router
