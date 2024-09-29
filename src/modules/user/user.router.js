import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { updateUserVal } from "./user.validation.js";
import { updateUser } from "./user.controller.js";


const userRouter = Router();

// update user
userRouter.put('/update/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(updateUserVal),
    asyncHandler(updateUser)
)

export default userRouter;