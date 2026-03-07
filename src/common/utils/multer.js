import multer from 'multer'
import {randomUUID} from 'node:crypto'
import { existsSync, fstat, mkdir, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
export const upload = ( customPath = "general")=>{


    const storage = multer.diskStorage({
        destination: function(req , file , cb){
            let fullPath = resolve(`./upload/${customPath}`)
            if(!existsSync(fullPath)){
                mkdirSync(fullPath , {recursive:true})
            }
            cb(null , fullPath )
        },
        filename: function(req , file , cb){
            console.log(file);
            const uniqueFileName = randomUUID() + '_' + file.originalname
            file.finalPath = `upload/${customPath}/${uniqueFileName}`
            cb(null , uniqueFileName )
        },
        
    })
    return multer({dest:'./temp' , storage})
}