import { authRouter, userRouter } from "./modules/index.js";
import { globalErrorHandling } from "./utils/appError.js";


export const bootStrap = (app, express) => {
    // parse req
    app.use(express.json());
    // routing 
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    // global error 
    app.use(globalErrorHandling)
}