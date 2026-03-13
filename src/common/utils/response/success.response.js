
export const successResponse = ({res , status=200 , message ='Done', result } = {} )=>{
    const response = {
        status,
        msg: message
    }

    if (result !== undefined) {
        response.result = result
    }

    return res.status(status).json(response)
}