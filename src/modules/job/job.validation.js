import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addJobVal = joi.object({
    jobTitle: generalFields.name.required(),
    jobLocation: generalFields.jobLocation.required(),
    workingTime: generalFields.workingTime.required(),
    seniorityLevel: generalFields.seniorityLevel.required(),
    jobDescription: generalFields.description.required(),
    technicalSkills: generalFields.technicalSkills.required(),
    softSkills: generalFields.softSkills.required()
})
export const updateJobVal = joi.object({
    jobId: generalFields.objectId.required(),
    jobTitle: generalFields.name.optional(),
    jobLocation: generalFields.jobLocation.optional(),
    workingTime: generalFields.workingTime.optional(),
    seniorityLevel: generalFields.seniorityLevel.optional(),
    jobDescription: generalFields.description.optional(),
    technicalSkills: generalFields.technicalSkills.optional(),
    softSkills: generalFields.softSkills.optional()
})
export const deleteJobVal = joi.object({
    jobId: generalFields.objectId.required()
})
export const getJobsByCompanyVal = joi.object({
    companyName: generalFields.name.optional()
})
export const applyJopVal = joi.object({
    jobId: generalFields.objectId.required(),
    userTechSkills: generalFields.technicalSkills.required(),
    userSoftSkills: generalFields.softSkills.required()
})
