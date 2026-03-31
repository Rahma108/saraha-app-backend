
import express from 'express'

import { authRouter , messageRouter, userRouter } from './modules/index.js'
// file config ............................................
import { NODE_ENV, ORIGINS, port } from '../config/config.service.js'
import { GlobalError } from './common/utils/response/error.response.js';
import { connectDB , connectRedis } from './DB/index.js';
import cors from 'cors'
import {resolve} from 'node:path'
import helmet from 'helmet'
import { Limiter } from './common/utils/middleware/limiter.js';

console.log({NODE_ENV});
async function bootstrap(){
const app = express()

const corsOptions = {
    origin: ORIGINS,
    optionsSuccessStatus: 200
}

// convert buffer data .....................
app.set("trust proxy", true)
app.use(cors(corsOptions) , Limiter, helmet() , express.json())
// load static files 
app.use('/upload', express.static(resolve('../upload/')))

// DB ....
await connectDB()
// #Redis
await connectRedis()
//application routing ......................
app.get('/' , async (req , res , next )=>{
    res.send('Hello')
    
})
app.use('/auth',authRouter)
app.use('/user', userRouter)
app.use('/message', messageRouter)

// invalid routing ....................
app.use('{/*dummy}' , (req , res , next)=>{
        return res.status(404).json({message : "invalid routing "})
})
// Handle Error ....................
app.use(GlobalError)
// return app;
// app.listen(port , ()=>{
//     console.log(`Listening on port ${port} 🚀🚀🚀🚀`);
    
// })

    if (process.env.NODE_ENV !== 'production') {
        app.listen(port, () => {
            console.log(`Listening on port ${port} 🚀🚀🚀🚀`);
        });
    }
    return app;
}
export default bootstrap