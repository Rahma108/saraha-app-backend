
import {EventEmitter} from 'node:events'
import { sendEmail } from './send.email.js'
import { emailTemplate } from './template.email.js'

export const emailEmitter = new EventEmitter()

emailEmitter.on("Confirm_Email" , async({to , subject="Verify_Account" , code ,title ="confirm-Email"  }={} )=>{
    try {
            await sendEmail({
            to ,
            subject,
            html:emailTemplate({code , title })
    
    })
    } catch (error) {
        console.log(`Fail to Sent User Email ${error} ❌`);
        
    }



})