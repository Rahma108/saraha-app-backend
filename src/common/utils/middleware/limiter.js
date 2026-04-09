
import {ipKeyGenerator, rateLimit} from 'express-rate-limit'
import geoip from 'geoip-lite'
import { redisClient } from '../../../DB/redis.connection.db.js'

export const Limiter = rateLimit({
    windowMs : 2 * 60 * 1000,
    limit:function(req){
        const country = geoip.lookup(req.ip)?.country || "Unknown"
        return country == "EG"?5000 : 3
    },
    legacyHeaders:true, 
    standardHeaders: true,
    skipFailedRequests:false,
    skipSuccessfulRequests:true,
    handler:(req , res , next)=>{
        return res.status(429).json({message:"TOO MANY REQUEST"})

    },
    keyGenerator:function(req , res , next){// 41.45.210.10
        const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip
        const ipV6 = ipKeyGenerator(ip, 56)  // Convert ip4 --> ip6
        console.log({ ipV6 })
        return `${ipV6}-${req.path}`
    },
    store: {
    async incr(key, cb) { // get called by keyGenerator
        try {
            const count = await redisClient.incr(key);
            if (count === 1) await redisClient.expire(key, 120); // 2 min TTL
            cb(null, count);
        } catch (err) {
            cb(err);
        }
        },
        async decrement(key) {  // called by kipFailedRequests:true ,  skipSuccessfulRequests:true,
            if(await redisClient.exists(key)){
                    await redisClient.decr(key);
            }
        },
    },
}) 
