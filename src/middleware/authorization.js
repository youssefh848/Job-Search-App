import { APPError } from "../utils/appError.js"
import { messages } from "../utils/constant/messaeges.js"

export const isAuthorized = (roles) => {
    return (req, res, next) => {
        // req >>> authUser
        if (!roles.includes(req.authUser.role)) {
            return next(new APPError(messages.user.unauthorized, 401))
        }   
        next()
    }
}