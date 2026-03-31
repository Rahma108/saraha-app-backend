import multer from 'multer'
import {randomUUID} from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

export const fieldValidation = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/pjpeg', 'image/x-png'],
    video: ['video/mp4'],
    files: ['application/pdf', 'text/plain']
}
export const upload = ( {customPath = "general" , validation = [] , size=5}={})=>{

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            let filePath = resolve(`../upload/${customPath}`);
            if (!existsSync(filePath)) {
                mkdirSync(filePath, { recursive: true });
            }
            cb(null, filePath);
        },
        filename: function(req, file, cb) {
            const uniqueFileName = randomUUID() + '_' + file.originalname;
            file.finalPath = `upload/${customPath}/${uniqueFileName}`;
            cb(null, uniqueFileName);
        },
    });

    const fileFilter = (req, file, cb) => {
        console.log("Uploading file type:", file.mimetype); // مهم تشوف الـ mimetype
        if (validation.length === 0 || validation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid File Format this endpoint only accept'));
        }
    };

    const limits = { fileSize: size * 1024 * 1024 }; // الحجم بالميجا

    return multer({ storage, fileFilter, limits });

}