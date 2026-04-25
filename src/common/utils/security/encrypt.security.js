

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
    if (!data || !data.includes(':')) {
        throw new Error("Invalid encrypted data format");
    }

    const parts = data.split(':');

    if (parts.length !== 2) {
        throw new Error("Corrupted encrypted data");
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    if (iv.length !== 16) {
        throw new Error("Invalid IV length");
    }

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
