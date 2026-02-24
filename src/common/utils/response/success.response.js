<<<<<<< HEAD
export const successResponse = ({res , status=200 , message ='Done', result= undefined } = {} )=>{
    return res.status(status).json({status , msg: message , result : {result }})
=======
export const successResponse = ({res , status=200 , message ='Done', result= undefined } = {} )=>{
    return res.status(status).json({status , msg: message , result : {result }})
>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
}