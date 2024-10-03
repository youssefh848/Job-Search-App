import { deleteCloudImage } from "./cloud.js";

export class APPError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.success = false;
    }
}




// globalErrorHandling
export const globalErrorHandling = async (err, req, res, next) => {

    // rollback cloud
    if (req.failResume) {
        await deleteCloudImage(req.failResume.public_id)
    }

    return res.status(err.statusCode || 500).json({
        message: err.message,
        success: false
    })

}