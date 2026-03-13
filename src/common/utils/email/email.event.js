
import {EventEmitter} from 'node:events'

export const emailEmitter = new EventEmitter()

emailEmitter.on("Confirm_Email" , async(emailFunction)=>{
    try {
        await emailFunction()
    

    } catch (error) {
        console.log(`Fail to Sent User Email ${error} ❌`);
        
    }

})