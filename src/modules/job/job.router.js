import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addJob, applyJob, deleteJob, getAllJobs, getJobsByCompany, updateJob } from "./job.controller.js";
import { addJobVal, updateJobVal, deleteJobVal, getJobsByCompanyVal, applyJopVal } from "./job.validation.js";
import { cloudUpload } from "../../utils/multer-cloud.js";

const jobRouter = Router();

// add job
jobRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(addJobVal),
    asyncHandler(addJob)
)

// update job
jobRouter.put('/:jobId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(updateJobVal),
    asyncHandler(updateJob)
)

// delete job
jobRouter.delete('/:jobId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(deleteJobVal),
    asyncHandler(deleteJob)
)

// Get all Jobs with their company’s information.
jobRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR, roles.USER]),
    asyncHandler(getAllJobs)
)

// Get all Jobs for a specific company.
jobRouter.get('/by-company',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(getJobsByCompanyVal),
    asyncHandler(getJobsByCompany)
)

// Apply to Job
jobRouter.post('/apply/:jobId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    cloudUpload().single('userResume'),
    isValid(applyJopVal),
    asyncHandler(applyJob)
)

export default jobRouter;
