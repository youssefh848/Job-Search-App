import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/enums.js";

// schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String,
        trim: true
    },
    DOB: {
        type: String,
        default: Date.now()
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.OFFLINE
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
},
    { timestamps: true, versionKey: false }
);

// set username
userSchema.pre('save', function (next) {
    if (!this.isModified('firstName') && !this.isModified('lastName')) {
        return next();
    }
    this.username = `${this.firstName}${this.lastName}`.toLowerCase(); // Create username from first and last name
    next();
});


// model
export const User = model('User', userSchema)