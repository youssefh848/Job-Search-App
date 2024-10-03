import { model, Schema } from "mongoose";
import { jobLcation, seniorityLevel, workingTime } from "../../src/utils/constant/enums.js";

// schema 
const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        enum: Object.values(jobLcation),
        required: true
    },
    workingTime: {
        type: String,
        enum: Object.values(workingTime),
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: Object.values(seniorityLevel),
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    technicalSkills: {
        type: [String],
        required: true
    },
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
}, { timestamps: true, versionKey: false })

// model
export const Job = model('Job', jobSchema)
