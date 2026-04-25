import { TokenTypeEnum } from "../../enums/security.enum.js"
import { BadRequestException } from "../response/error.response.js"
import { decodeToken } from "../security/token.security.js"

export const authentication = (tokenType = TokenTypeEnum.access) => {
    return async (req, res, next) => {
        try {
        if (!req?.headers?.authorization) {
            throw BadRequestException({ message: "Missing authorization key" });
        }

        const { authorization } = req.headers;
        const [flag, credentials] = authorization.split(" ");

        if (!flag || !credentials) {
            throw BadRequestException({ message: "Invalid authorization parts" });
        }

        switch (flag) {
            case "Basic":
            const data = Buffer.from(credentials, "base64").toString();
            const [username, password] = data.split(":");
            console.log({ username, password });
            break;

            case "Bearer":
            const { user, decoded } = await decodeToken({
                token: credentials,
                tokenType,
            });

            if (user.isDeleted) {
                throw BadRequestException({
                message: "Account is frozen, please login again to unfreeze",
                });
            }

            req.user = user;
            req.decoded = decoded;
            break;

            default:
            throw BadRequestException({ message: "Invalid authorization flag" });
        }

        next();
        } catch (error) {
        next(error);
        }
    };
};