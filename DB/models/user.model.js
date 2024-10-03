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
userSchema.pre('save', async function (next) {
    if (!this.isModified('firstName') && !this.isModified('lastName')) {
        return next()
    }
    // Create initial username
    let username = `${this.firstName}${this.lastName}`.toLowerCase()
    // Check if username exists
    let existingUser = await this.constructor.findOne({ username })

    let suffix = 1;
    // Loop until finding a unique username
    while (existingUser) {
        username = `${this.firstName}${this.lastName}${suffix}`.toLowerCase()
        existingUser = await this.constructor.findOne({ username })
        suffix++;
    }
    // Set the unique username
    this.username = username
    next()
});



// model
export const User = model('User', userSchema)