// logic
import { createLoginCredentials} from "../../common/utils/security/token.security.js";

// Access .......................................
export const profile= async  (user)=>{
    return user
}

// refresh ........................................

export const rotateToken = async  (user, issuer)=>{
    return await createLoginCredentials(user , issuer )
}

