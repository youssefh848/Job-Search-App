import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {  getProfileVal, updatePasswordVal, updateUserVal } from "./user.validation.js";
import { deleteUser, getProfile, getUser, updatePassword, updateUser } from "./user.controller.js";


const userRouter = Router();

// update account
userRouter.put('/update/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(updateUserVal),
    asyncHandler(updateUser)
)

// delete account
userRouter.delete('/delete',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(deleteUser)
)

// Get user account data 
userRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(getUser)
)

// Get profile data for another user 
userRouter.get('/profile/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(getProfileVal),
    asyncHandler(getProfile)
)

// Update password 
userRouter.patch('/update-password',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(updatePasswordVal),
    asyncHandler(updatePassword)
)



export default userRouter;