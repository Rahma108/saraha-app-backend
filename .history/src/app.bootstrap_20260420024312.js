
import express from 'express'

import { authRouter , messageRouter, userRouter } from './modules/index.js'
// file config ............................................
import { NODE_ENV, port } from '../config/config.service.js'
import { GlobalError } from './common/utils/response/error.response.js';
import { connectDB , connectRedis } from './DB/index.js';
import cors from 'cors'
import {resolve} from 'node:path'
import helmet from 'helmet'
import { Limiter } from './common/utils/middleware/limiter.js';

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// upload folder داخل المشروع أو configured path
const UPLOAD_PATH = path.join(__dirname, "..", "..", "upload", "general");
// import {rateLimit} from 'express-rate-limit'
console.log({NODE_ENV});
async function bootstrap(){
const app = express()


// convert buffer data .....................
app.set("trust proxy", true)
app.use(cors() , Limiter, helmet() , express.json())
// load static files 
app.use('/upload', express.static(resolve('./upload')));

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

app.listen(port , ()=>{
    console.log(`Listening on port ${port} 🚀🚀🚀🚀`);
    
})

}
export default bootstrap