
import {resolve} from 'node:path'
import {config} from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV

const envPath = {
    development : `.env.dev`,
    production :`.env.prod`
}

config({path:resolve(`./config/${envPath[NODE_ENV]}`)})
export const port = process.env.PORT ?? 7000


export const ORIGINS= process.env.ORIGINS.split(",")
export const DB_URI = process.env.DB_URI

export const REDIS_URI= process.env.REDIS_URI
// 
export const SALT_ROUND= parseInt(process.env.SALT_ROUND ?? '10') 
export const IV_LENGTH = parseInt(process.env.IV_LENGTH ?? '16')
export const SECURITY_KEY = process.env.SECURITY_KEY

export const System_TOKEN_SECURITY_KEY = process.env.System_TOKEN_SECURITY_KEY
export const User_TOKEN_SECURITY_KEY= process.env.User_TOKEN_SECURITY_KEY

export const System_REFRESH_TOKEN_SECURITY_KEY = process.env.System_REFRESH_TOKEN_SECURITY_KEY
export const User_REFRESH_TOKEN_SECURITY_KEY= process.env.User_REFRESH_TOKEN_SECURITY_KEY

export const ACCESS_EXPIRES_IN= parseInt(process.env.ACCESS_EXPIRES_IN)
export const REFRESH_EXPIRES_IN= parseInt(process.env.REFRESH_EXPIRES_IN)

// OTP
export const GMAIL=process.env.GMAIL
export const PASSWORD=process.env.PASSWORD
export const APPLICATION_NAME=process.env.APPLICATION_NAME

export const LINKEDIN_LINK=process.env.LINKEDIN_LINK
export const GITHUB=process.env.GITHUB
export const INSTAGRAM_LINK=process.env.INSTAGRAM_LINK

export const ClientID=process.env.ClientID
