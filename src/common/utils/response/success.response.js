
export const successResponse = ({res , status=200 , message ='Done', result= undefined } = {} )=>{
    return res.status(status).json({status , msg: message , result : {result }})
}