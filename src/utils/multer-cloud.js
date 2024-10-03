// import modules
import multer, { diskStorage } from "multer";
import { APPError } from './appError.js';

export const fileValidation = {
    file: ['application/pdf']
}

export const cloudUpload = ({ allowFile = fileValidation.file } = {}) => {
    const storage = diskStorage({})
    const fileFilter = (req, file, cb) => {
        if (allowFile.includes(file.mimetype)) {
            return cb(null, true)
        }
        return cb(new APPError('invalid file format', 400), false)
    }
    return multer({ storage, fileFilter })

}
