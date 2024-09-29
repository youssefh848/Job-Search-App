import { APPError } from "../utils/appError.js"

// asyncHandler
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next)
            .catch((err) => {
                next(new APPError(err.message, err.statusCode || 500))
            })
    }
}