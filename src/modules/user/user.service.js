// logic

import { System_REFRESH_TOKEN_SECRET_KEY, System_TOKEN_SECRET_KEY, User_REFRESH_TOKEN_SECRET_KEY, User_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { findById } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"



// Token .................
import jwt from 'jsonwebtoken'

export const profile = async (authorization)=>{
    console.log({authorization});
    const decoded = jwt.decode(authorization)
    console.log({decoded});


        let signature = undefined
        switch (decoded.aud) {
            case 'System':
            signature = System_TOKEN_SECRET_KEY
            break;
            // case 'Refresh_System':
            // signature = System_REFRESH_TOKEN_SECRET_KEY
            // break;
            default:
            signature = User_TOKEN_SECRET_KEY
            break;
    }
    const verifyData = jwt.verify(authorization , signature )
    console.log({verifyData});
//     {
//   authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTkyM2NiMTZmM2Y4ZjgwOWJkZGM1MGYiLCJpYXQiOjE3NzExOTgwOTl9.6is_a9dKHfWTr76wP6cEBwSlmd3Bywzl90rMsPv-OAI'
// }
// { decoded: { sub: '69923cb16f3f8f809bddc50f', iat: 1771198099 } }
// { verifyData: { sub: '69923cb16f3f8f809bddc50f', iat: 1771198099 } }


const id = verifyData.sub
    const user = await findById({
        id , 
        model:UserModel , 
    })
    return user
}



export const RotateToken = async (authorization)=>{
    console.log({authorization});
    const decoded = jwt.decode(authorization)
    console.log({decoded});


        let signature = undefined
        switch (decoded.aud) {
            case 'Refresh_System':
            signature = System_REFRESH_TOKEN_SECRET_KEY
            break;
            default:
            signature = User_REFRESH_TOKEN_SECRET_KEY
            break;
    }
    const verifyData = jwt.verify(authorization , signature )
    console.log({verifyData});
    const access_token = jwt.sign({} ,System_TOKEN_SECRET_KEY,
        {
            subject:decoded.sub ,
            noTimestamp:true , 
            expiresIn:  30 * 60 , 
        }
    )
    return access_token
}

