
// npm i bcrypt to hash password ....

// Don’t forget to hash the password 
import { HashEnum } from '../../enums/index.js';
import * as argon2 from 'argon2'
import { SALT_ROUND } from '../../../../config/config.service.js';
import { compare, hash } from 'bcrypt'
export const generateHash = async( plaintext , salt = SALT_ROUND , algorithm= HashEnum.Bcrypt )=>{
    let hashResult = ''
    switch (algorithm) {
        case HashEnum.Argon2:
            hashResult= await argon2.hash(plaintext)
            break;
    
        default:
            hashResult= await hash(plaintext  , salt )
            break;
    }
    return hashResult
}

export const compareHash = async( plaintext , cipherText , algorithm =HashEnum.Bcrypt)=>{
    let match = false 
    switch(algorithm){
            case HashEnum.Bcrypt:
            match = await compare(plaintext , cipherText )
            break;
        case HashEnum.Argon2:
            match = await argon2.verify(cipherText , plaintext )
            break;
        default:
            match = await compare(plaintext , cipherText )
            break;
    }
    return match

}




