import express from 'express'

import { authRouter , userRouter , otpRouter } from './modules/index.js'
// file config ............................................
import { NODE_ENV, port } from '../config/config.service.js'
import { GlobalError } from './common/utils/response/error.response.js';
import { connectDB } from './DB/connection.db.js';



console.log({NODE_ENV});
async function bootstrap(){
const app = express()

// convert buffer data .....................
app.use(express.json())

// DB ....
await connectDB()

//application routing ......................
app.get('/' , (req , res , next )=>{
    res.send('Hello')
    
})

app.use('/auth',authRouter)
app.use('/user', userRouter)
app.use('/otp' , otpRouter)

// invalid routing ....................
app.use('{/*dummy}' , (req , res , next)=>{
        return res.status(404).json({message : "invalid routing "})
})
// Handle Error ....................
app.use(GlobalError)
app.listen(port , ()=>{
    console.log(`Listening on port ${port} 🚀🚀🚀🚀`);
    
})
}
export default bootstrap