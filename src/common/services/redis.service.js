
import { redisClient } from "../../DB/index.js";

export const revokeTokenKey = ({userId , jti })=>{
    return `${baseRevokeTokenKey(userId)}::${jti}`
}

export const otpKey = (email)=>{
    return `OTP:USER::${email}`
}
export const baseRevokeTokenKey = (userId)=>{
    return `RevokeToken::${userId}`
}
export const set = async ({key , value , ttl } ={} )=>{
    try {
        let data = typeof value === 'string'?value : JSON.stringify(value)
        return ttl ? await redisClient.set(key ,data ,{EX:ttl }  ): await redisClient.set(key , data )
    } catch (error) {
        console.log(`Fail in redis set Operations ${error}`);
    }
}

export const update = async ({key , value , ttl } ={} )=>{
    try {
        if(!await redisClient.exists(key))return 0 
        return await set({key , value , ttl})
    } catch (error) {
        console.log(`Fail in redis  update Operations ${error}`);
    }
}

export const get = async (key)=>{
    try {
        try {
            return JSON.parse(await redisClient.get(key))
            
        } catch (error) {
            return await redisClient.get(key)
        }
    } catch (error) {
        console.log(`Fail in redis get Operations ${error}`);
    }
}

export const  ttl = async (key)=>{
    try {
        return await redisClient.ttl(key)
    } catch (error) {
        console.log(`Fail in redis ttl Operations ${error}`);
    }
}

export const  exists = async (key)=>{
    try {
        return await redisClient.exists(key)
    } catch (error) {
        console.log(`Fail in redis exists Operations ${error}`);
    }
}

export const  expire = async ({key , ttl} = {} )=>{
    try {
        return await redisClient.expire(key , ttl)
    } catch (error) {
        console.log(`Fail in redis expire Operations ${error}`);
    }
}


export const  mGet= async (keys = [] )=>{
    try {
        if(!keys.length){
            return 0
        }
        return await redisClient.mGet(keys, ttl)
    } catch (error) {
        console.log(`Fail in redis mGet Operations ${error}`);
    }
}

export const  keys = async (prefix )=>{
    try {
        return await redisClient.keys(`${prefix}*`)
    } catch (error) {
        console.log(`Fail in redis keys Operations ${error}`);
    }
}

export const  deleteKeys= async (keys )=>{
    try {
        if(!keys.length){
            return 0
        }
        return await redisClient.del(keys)
    } catch (error) {
        console.log(`Fail in redis  del Operations ${error}`);
    }
}
