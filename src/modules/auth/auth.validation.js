import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signupVal = joi.object({
    firstName: generalFields.name.required(),
    lastName: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.required(),
    mobileNumber: generalFields.mobileNumber.required(),
    recoveryEmail: generalFields.email.optional(),
    DOB: generalFields.DOB.optional()
})
export const loginVal = joi.object({
    // Check if at least one of mobileNumber or recoveryEmail exists
    email: generalFields.email.optional(),
    mobileNumber: generalFields.mobileNumber.optional(),
    recoveryEmail: generalFields.email.optional(),
    password: generalFields.password.required(),
}).or('email', 'mobileNumber', 'recoveryEmail');

export const forgetPasswordVal = joi.object({
    email: generalFields.email.required()
})

export const resetPasswordVal = joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    newPassword: generalFields.password.required(),
    cPassword: generalFields.password.required().valid(joi.ref('newPassword')).required()
});