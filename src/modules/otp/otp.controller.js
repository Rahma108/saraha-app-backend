import {Router} from 'express'
import { ErrorException, successResponse } from '../../common/utils/response/index.js'
import {  sendOtpFunction, verifyOtp } from './otp.service.js'
const router = Router() // app

router.post('/send-otp', async (req, res, next) => {
    try {
        const result = await sendOtpFunction(req.body); // body فيها { email: "..." }
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