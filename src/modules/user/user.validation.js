import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const updateUserVal = joi.object({
    userId: generalFields.objectId.required(),
    firstName: generalFields.name.optional(),
    lastName: generalFields.name.optional(),
    email: generalFields.email.optional(),
    mobileNumber: generalFields.mobileNumber.optional(),
    recoveryEmail: generalFields.email.optional(),
    DOB: generalFields.DOB.optional()
})

