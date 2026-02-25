

import { verifyToken } from "../security/jwt.js";


// extract userId from token ..
// Middle Ware ..
export const authenticateUser = async (req , res , next)=>{
    const authHeader = req.headers.authorization; // Bearer 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token)
    req.userId = decoded.userId; 
    next();  //Middleware .........
>>>>>>> c53f0c44fb9e3dda51d06d50a8a868b76a8a2da1
}