import { model, Schema, Types } from "mongoose";

// schema
const applicationSchema = new Schema({
    jobId: {
        type: Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        require: true
    },
    userResume: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    }
}, { timestamps: true, versionKey: false })

// model
export const Application = model('Application', applicationSchema)