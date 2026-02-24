// store .................

import mongoose from "mongoose"
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enums/user.enum.js"

const userSchema =  new mongoose.Schema({

        firstName :{
            type:String , 
            required:true , 
            minLength:[2 , "FirstName cannot be less than 2 characters, you entered {VALUE}"] ,
            maxLength: 25 , 
            trim : true 
        },
        lastName :{
            type:String , 
            required:true , 
            minLength:[2 , "LastName cannot be less than 2 characters, you entered {VALUE}"] ,
            maxLength: 25 , 
            trim : true 
        },
        email :{
            type:String , 
            required:true , 
            unique:true ,
        },
        password :{
            type:String , 
            required:true , 
        },
        gender:{
            type:Number, 
            enum :Object.values(GenderEnum),
            default : GenderEnum.Male 
        },
        DOB:{
            type:Date
        },
        phone:{
            type:String
        },
        confirmEmail:{
            type:Date
        },
        provider:{
            type:Number , 
            enum : Object.values(ProviderEnum),
            default : ProviderEnum.System
        },
        role:{
            type:Number , 
            enum : Object.values(RoleEnum),
            default : RoleEnum.User
        },
        changeCredentialTime: {
            type:Date
        },
        profilePicture : {
            type:String
        },
        coverProfilePicture : {
            type:[String]
        },
},{
    collection:"users" ,
    timestamps:true ,
    strict:true ,
    strictQuery:true ,
    optimisticConcurrency: true ,
    autoIndex:true ,
    toJSON:{virtuals:true} ,
    toObject:{virtuals:true}
})
// Virtual .....
userSchema.virtual('userName').set(function(value){
    const [firstName , lastName ] = value?.split(' ') || []
    this.set({firstName , lastName })
}).get(function(){
    return this.firstName + " " + this.lastName
})

export const UserModel = mongoose.model.User || mongoose.model("User" , userSchema )










