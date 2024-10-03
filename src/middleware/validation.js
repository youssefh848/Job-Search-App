// import modules
import joi from 'joi';
import { APPError } from '../utils/appError.js';
import { jobLcation, seniorityLevel, workingTime } from '../utils/constant/enums.js';

const parseArray = (value, helper) => {
    let data = JSON.parse(value)
    let schema = joi.array().items(joi.string())
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) { return helper(error.details) }
    return true
}

export const generalFields = {
    name: joi.string(),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword: joi.string().valid(joi.ref('password')),
    mobileNumber: joi.string().pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/)),
    DOB: joi.string()
        .regex(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
        .message('Date of birth must be in format YYYY-M-D or YYYY-MM-DD'),
    objectId: joi.string().hex().length(24),
    otp: joi.string().length(6),
    description: joi.string().max(2000),
    numberOfEmployees: joi.string().pattern(/^(?:[1-9]\d{0,2})-(?:[1-9]\d{0,2})$/),
    jobLocation: joi.string().valid(...Object.values(jobLcation)),
    workingTime: joi.string().valid(...Object.values(workingTime)),
    seniorityLevel: joi.string().valid(...Object.values(seniorityLevel)),
    technicalSkills: joi.custom(parseArray),
    softSkills: joi.custom(parseArray),
    // stock: joi.number().positive(),
    // price: joi.number().positive(),
    // discount: joi.number(),
    // sizes: joi.custom(parseArray),
    // rate: joi.number().min(1).max(5),
    // comment: joi.string().max(2000),
    // rate: joi.number().min(1).max(5),
    // code: joi.string().max(6),
    // discountAmount: joi.number().positive(),
    // fromDate: joi.date().greater(Date.now() - 24 * 60 * 60 * 1000),
    // toDate: joi.date().greater(joi.ref('fromDate'))
}

export const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query }
        const { error } = schema.validate(data, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new APPError(errorMessage, 400));
        }
        next()
    }
}