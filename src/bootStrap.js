import { authRouter, companyRouter, userRouter } from "./modules/index.js";
import { globalErrorHandling } from "./utils/appError.js";


export const bootStrap = (app, express) => {
    // parse req
    app.use(express.json());
    // routing 
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/company', companyRouter)
    // global error 
    app.use(globalErrorHandling)
}