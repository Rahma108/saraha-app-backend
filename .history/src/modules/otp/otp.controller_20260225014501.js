
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
>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
export default router