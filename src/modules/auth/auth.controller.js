
import {Router} from 'express'
import { confirmEmail, login, loginWithGmail, requestForgotPasswordCode, reSendConfirmEmail, resendForgotPasswordCode, signup, signupWithGmail, verifyForgotPasswordCode } from './auth.service.js'
import {  ErrorException, successResponse, validation } from '../../common/utils/index.js'
import * as validators from './auth.validation.js'
const router = Router() // app
router.post('/signup' ,  validation(validators.signupSchema) , async(req , res , next )=>{
    const result = await signup(req.body)
    return  successResponse({res , status:201 , result})

})

router.patch('/confirm-email' ,  validation(validators.confirmEmailSchema) , async(req , res , next )=>{
    const result = await confirmEmail(req.body)
    return  successResponse({res})

})
router.patch('/resend-confirm-email' ,  validation(validators.resendConfirmEmailSchema) , async(req , res , next )=>{
    const result = await reSendConfirmEmail(req.body)
    return  successResponse({res})

})
// Forget Password 
router.post('/request-forgot-password-code' ,  validation(validators.verifyEmailSchema) , async(req , res , next )=>{
    await requestForgotPasswordCode(req.body)
    return  successResponse({res , status:201})

})
router.patch('/verify-forgot-password-code' ,  validation(validators.verifyForgotPasswordSchema) , async(req , res , next )=>{
    await verifyForgotPasswordCode(req.body)
    return  successResponse({res , status:200})

})

router.patch('/resend-forgot-password-code' ,  validation(validators.resetForgotPasswordSchema) , async(req , res , next )=>{
    await resendForgotPasswordCode(req.body)
    return  successResponse({res , status:200})
})
router.post('/login',validation(validators.loginSchema), async(req , res , next )=>{

    const result = await login(req.body , `${req.protocol}://${req.host}`)
    return successResponse({res ,  result:{...result}})
})
// Signup with Google
router.post('/signup/gmail', validation(validators.googleSignupSchema), async (req, res, next) => {
  try {
    const issuer = `${req.protocol}://${req.get('host') || 'localhost:3000'}`;
    const { account, status } = await signupWithGmail({
    idToken: req.body.idToken,
    issuer
});
    return successResponse({ res, status:status, result: { account } });
  } catch (err) {
    console.error("Signup Gmail Error:", err);
    return ErrorException({ res, status: 500, message: err.message || 'something went wrong' });
  }
});

// Login with Google
router.post('/login/gmail', validation(validators.googleLoginSchema), async (req, res, next) => {
  try {
    const issuer = `${req.protocol}://${req.get('host') || 'localhost:3000'}`;
    const account = await loginWithGmail({
      idToken: req.body.idToken,
      issuer
    });
    return successResponse({ res, result: { account } });
  } catch (err) {
    console.error("Login Gmail Error:", err);
    return ErrorException({ res, status: 500, message: err.message || 'something went wrong' });
  }
});


export default router
