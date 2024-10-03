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

/**
 * Adds a new job .
 * 
 * @async
 * @function addJob
 * @param {Object} req - The request object containing job data.
 * @param {Object} res - The response object to send back job creation response.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with the created job details.
 */
jobRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(addJobVal),
    asyncHandler(addJob)
)

/**
 * Updates an existing job .
 * 
 * @async
 * @function updateJob
 * @param {Object} req - The request object containing job update data.
 * @param {Object} res - The response object to send back job update response.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with the updated job details.
 */
jobRouter.put('/:jobId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(updateJobVal),
    asyncHandler(updateJob)
)

/**
 * Deletes a job.
 * 
 * @async
 * @function deleteJob
 * @param {Object} req - The request object containing job ID to delete.
 * @param {Object} res - The response object to send back job deletion response.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response indicating the deletion status.
 */
jobRouter.delete('/:jobId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(deleteJobVal),
    asyncHandler(deleteJob)
)


/**
 * Retrieves all jobs with their associated company's information.
 * 
 * @async
 * @function getAllJobs
 * @param {Object} req - The request object to filter and sort jobs.
 * @param {Object} res - The response object to send back job data.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with a list of jobs.
 */
jobRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR, roles.USER]),
    asyncHandler(getAllJobs)
)

/**
 * Retrieves jobs for a specific company based on the company's name.
 * 
 * @async
 * @function getJobsByCompany
 * @param {Object} req - The request object containing company name in query.
 * @param {Object} res - The response object to send back jobs for the specified company.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with a list of jobs for the company.
 */
jobRouter.get('/by-company',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(getJobsByCompanyVal),
    asyncHandler(getJobsByCompany)
)
/**
 * Allows a user to apply for a job by submitting their application.
 * 
 * @async
 * @function applyJob
 * @param {Object} req - The request object containing job ID and application data.
 * @param {Object} res - The response object to send back application submission response.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with the details of the submitted application.
 */
jobRouter.post('/apply/:jobId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    cloudUpload().single('userResume'),
    isValid(applyJopVal),
    asyncHandler(applyJob)
)

export default jobRouter;
