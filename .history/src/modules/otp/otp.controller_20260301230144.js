
import {Router} from 'express'
import { ErrorException, successResponse } from '../../common/utils/response/index.js'
import {  sendOtpFunction, verifyOtp } from './otp.service.js'
const router = Router() // app

// ال user هو ال بيطلب ف حالة ال forget Password ..
router.post('/resend-otp', async (req, res, next) => {
    try {
        const result = await sendOtpFunction(req.body); 
        return successResponse({ res, status: 201, result });
    } catch (err) {
        return ErrorException({ res, status: 500, message: err.message });
    }
});

router.post('/verify-otp' , async(req , res , next )=>{
    const result = await verifyOtp(req.body)
    return successResponse({res , result })
})

export default router