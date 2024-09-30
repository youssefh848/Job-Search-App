import { model, Schema } from "mongoose";

// schema
const companySchema = new Schema({
    companyName: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    industry: {
        type: String,
        require: true,
        trim: true
    },
    address: {
        type: String,
        require: true,
        trim: true
    },
    numberOfEmployees: {
        type: String,
        require: true
    },
    companyEmail: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
}, { timestamps: true, versionKey: false })


// model
export const Company = model('Company', companySchema)