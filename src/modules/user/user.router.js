import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getProfileVal, RrecoveryEmailVal, updatePasswordVal, updateUserVal } from "./user.validation.js";
import { deleteUser, getProfile, getRecoveryEmailAccounts, getUser, updatePassword, updateUser } from "./user.controller.js";


const userRouter = Router();

// update account
userRouter.put('/update/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(updateUserVal),
    asyncHandler(updateUser)
)

// delete account
userRouter.delete('/delete',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    asyncHandler(deleteUser)
)

// Get user account data 
userRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    asyncHandler(getUser)
)

// Get profile data for another user 
userRouter.get('/profile/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(getProfileVal),
    asyncHandler(getProfile)
)

// Update password 
userRouter.patch('/update-password',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(updatePasswordVal),
    asyncHandler(updatePassword)
)

// Get all accounts associated to a specific recovery Email 
userRouter.get('/recovery-email/:recoveryEmail',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(RrecoveryEmailVal),
    asyncHandler(getRecoveryEmailAccounts)
)



export default userRouter