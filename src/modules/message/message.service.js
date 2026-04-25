
import { createOne, deleteOne, find, findById, findOne, MessageModel, UserModel } from "../../DB/index.js"
import { NotFoundException } from "../../common/utils/index.js"


export const sendMessage = async(receiverId , files=[] , {content} , sender )=>{
    const receiver = await findOne({
        model:UserModel ,
        filter:{
            _id:receiverId ,
            confirmEmail:{ $ne: null }
        },
    })
    if(!receiver){
        throw NotFoundException({message:"No Matching Account ❌"})
    }
    const message = await createOne({
        model:MessageModel,
        data:{
            content ,
            attachments:files.map(file => file.finalPath),
            receiverId,
            senderId: sender?._id || null, // ✅ لو anonymous يبقى null

        }

    })
    return message
}

export const getMessageById = async(messageId , user)=>{
    const message = await findOne({
        model:MessageModel ,
        filter:{
            _id :messageId ,
            $or:[
                { senderId:user._id},
                { receiverId:user._id},
        ]
        },
        select:"-senderId"
    })
    if(!message){
        throw NotFoundException({message : "Invalid Message or No authorization"})
    }
    return message
}

export const deleteById = async(messageId , user)=>{
    const message = await deleteOne({
        model:MessageModel ,
        filter:{
            _id :messageId ,
            $or:[
                { senderId:user._id},
                { receiverId:user._id},
        ]
        },
    })
    if(!message.deletedCount){
        throw NotFoundException({message : "Invalid Message or No authorization"})
    }
    return message
}

export const getAllMessages = async( user)=>{
    if(!user){
        throw new Error("User not found in request")
    }
    const messages = await find({
        model:MessageModel ,
        filter:{
            $or:[
                { senderId:user._id},
                { receiverId:user._id},
        ]
        },
    })
    return messages
}

export const toggleFavourite = async(messageId, user) => {
    const message = await findOne({
        model: MessageModel,
        filter: {
            _id: messageId,
            receiverId: user._id  // بس الـ receiver يقدر يعمل favourite
        }
    });

    if (!message) {
        throw NotFoundException({ message: "Invalid Message or No authorization" });
    }

    message.isFavourite = !message.isFavourite;
    await message.save();
    return message;
}





export const getFavouriteMessages = async(user) => {
    const messages = await find({
        model: MessageModel,
        filter: {
            receiverId: user._id,
            isFavourite: true
        }
    });
    return messages;
}







