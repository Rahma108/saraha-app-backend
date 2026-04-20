
// Connect to db .........................
import mongoose from "mongoose";

import {DB_URI} from '../../config/config.service.js'
import { UserModel } from "./model/user.model.js";
export const connectDB = async ()=>{
        try{
            const result = await mongoose.connect(DB_URI , {serverSelectionTimeoutMS : 3000})
            await UserModel.syncIndexes()
            console.log(`DB connect Successfully 😎`);
        }catch(error){
            console.log(`Fail to connect on DB 🫠🫠🫠 ${error}`);

        }

}