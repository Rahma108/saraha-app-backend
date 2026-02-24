<<<<<<< HEAD

import crypto from 'crypto';
import { IV_LENGTH, SECURITY_KEY } from '../../../../config/config.service.js';

const algorithm = 'aes-256-cbc';


const key = Buffer.from(SECURITY_KEY); 

export const encrypt = (text) => {

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (data) => {
    const parts = data.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const message = "Hello World";
const encrypted = encrypt(message);
const decrypted = decrypt(encrypted);

console.log({ encrypted, decrypted });

=======

import crypto from 'crypto';
import { IV_LENGTH, SECURITY_KEY } from '../../../../config/config.service.js';

const algorithm = 'aes-256-cbc';


const key = Buffer.from(SECURITY_KEY); 

export const encrypt = (text) => {

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (data) => {
    const parts = data.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

const message = "Hello World";
const encrypted = encrypt(message);
const decrypted = decrypt(encrypted);

console.log({ encrypted, decrypted });

>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
