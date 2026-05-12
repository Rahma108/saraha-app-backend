import { TokenTypeEnum } from "../../enums/security.enum.js"
import { BadRequestException } from "../response/error.response.js"
import { decodeToken } from "../security/token.security.js"

export const authentication = (tokenType = TokenTypeEnum.access) => {
    return async (req, res, next) => {
        try {
        
        const authHeader = req?.headers?.authorization;

        if (!authHeader) {
            throw BadRequestException({ message: "Missing authorization header" });
        }

        const [flag, credentials] = authHeader.split(" ");

        if (!flag || !credentials) {
            throw BadRequestException({ message: "Invalid authorization format" });
        }

        let user, decoded;

        switch (flag) {

            case "Basic": {
            const data = Buffer.from(credentials, "base64").toString();
            const [username, password] = data.split(":");
            console.log({ username, password });
            break;
            }

            case "Bearer": {
            const result = await decodeToken({
                token: credentials,
                tokenType,
            });
            if (!result || !result.user) {
                throw BadRequestException({ message: "Invalid token" });
            }

            user = result.user;
            decoded = result.decoded;

            if (!user._id) {
                throw BadRequestException({ message: "Invalid user in token" });
            }

            if (user.isDeleted) {
                throw BadRequestException({
                message: "Account is frozen, please login again",
                });
            }

            break;
            }

            default:
            throw BadRequestException({ message: "Invalid authorization type" });
        }
        req.user = user;
        req.decoded = decoded;

        return next();

        } catch (error) {
        return next(error);
        }
    };
};