
import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String ,
        minLength:2 ,
        maxLength:10000,
        required:function(){
            return !this.attachments?.length
        }
    },
    attachments:{
        type:[String] 
    },
    isFavourite: {
    type: Boolean,
    default: false
}

},{
    timestamps:true , 
    collection:"SARAHA_MESSAGES" ,
    strict:true, 
    strictQuery:true

})
export const MessageModel = mongoose.models.Message || mongoose.model('Message' , messageSchema )