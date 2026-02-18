import { NODE_ENV } from "../../../../config/config.service.js"

export const GlobalError =(error ,  req , res , next )=>{

    const status = error.cause?.status?? 500

    return res.status(status).json({
        error_message :   status == 500? 'something went wrong ': error.message ??'something went wrong ',
        // Node-Env ...........................................(development OR  production )
        stack : NODE_ENV == 'development' ? error.stack : undefined ,
        extra: error.cause?.extra
    })
}

// Error Templates 
export const ErrorException = ({message='Fail' , cause=undefined } = {} )=>{
    throw new Error( message , {cause} )
}
export const BadRequestException = ({ message='BadRequestException' , extra = undefined }  = {} )=>{
    return ErrorException({message , cause:{status:400} , extra })
}
export const UnauthorizedException = ({ message='UnauthorizedException' , extra =undefined } = {} )=>{
    return ErrorException({message , cause:{status:401} , extra })
}
export const forbiddenException = ({message='forbiddenException' , extra = undefined } = {} )=>{
    return ErrorException({message , cause:{status:403} , extra })
}
export const NotFoundException = ({ message='NotFoundException' , extra ={undefined} }= {} )=>{
    return ErrorException({message , cause:{status:404} , extra })
}
export const ConflictException = ({message='ConflictException' , extra = undefined} = {} )=>{
    return ErrorException({message , cause:{status:409} , extra })
}
