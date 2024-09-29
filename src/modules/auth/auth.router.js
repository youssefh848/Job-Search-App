import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { forgetPasswordVal, loginVal, signupVal } from "./auth.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { forgotPassword, login, signup, verifyAccount } from "./auth.controller.js";


const authRouter = Router();
// signup
authRouter.post('/signup', isValid(signupVal), asyncHandler(signup))
// verify account
authRouter.get('/verify/:token', asyncHandler(verifyAccount))
// login
authRouter.post('/login', isValid(loginVal), asyncHandler(login))
// Forget password
authRouter.post('/forget-password',
    isValid(forgetPasswordVal),
    asyncHandler(forgotPassword)
)

export default authRouter;
