import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addCompanyVal = joi.object({
    companyName: generalFields.name.required(),
    description: generalFields.description.required(),
    industry: generalFields.name.required(),
    address: generalFields.name.required(),
    numberOfEmployees: generalFields.numberOfEmployees.required(),
    companyEmail: generalFields.email.required()
})

export const updateCompanyVal = joi.object({
    companyId: generalFields.objectId.required(),
    companyName: generalFields.name.optional(),
    description: generalFields.description.optional(),
    industry: generalFields.name.optional(),
    address: generalFields.name.optional(),
    numberOfEmployees: generalFields.numberOfEmployees.optional(),
    companyEmail: generalFields.email.optional()
})

export const deleteCompanyVal = joi.object({
    companyId: generalFields.objectId.required()
})

export const getCompanyVal = joi.object({
    companyId: generalFields.objectId.required()
})

export const searchCompanyByNameVal = joi.object({
    companyName: generalFields.name.required()
})

export const getApplicationJobVal = joi.object({
    jobId: generalFields.objectId.required()
})
