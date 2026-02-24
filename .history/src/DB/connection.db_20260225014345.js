
// Connect to db .........................
import mongoose from "mongoose";

import {DB_URI} from '../../config/config.service.js'
export const connectDB = async ()=>{
        try{
            const result = await mongoose.connect(DB_URI , {serverSelectionTimeoutMS : 3000})
            console.log(`DB connect Successfully 😎`);
        }catch(error){
            console.log(`Fail to connect on DB 🫠🫠🫠 ${error}`);

        }

>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
}