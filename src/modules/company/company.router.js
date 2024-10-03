import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCompanyVal, deleteCompanyVal, getApplicationJobVal, getCompanyVal, searchCompanyByNameVal, updateCompanyVal } from "./company.validation.js";
import { addCompany, deleteCompany, getApplicationJob, getCompany, searchCompanyByName, updateCompany } from "./company.controller.js";

const companyRouter = Router();

// add company 
companyRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(addCompanyVal),
    asyncHandler(addCompany)
)

// update company
companyRouter.put('/:companyId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(updateCompanyVal),
    asyncHandler(updateCompany)
)

// delete company 
companyRouter.delete('/:companyId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(deleteCompanyVal),
    asyncHandler(deleteCompany)
)

// get company data
companyRouter.get('/get/:companyId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(getCompanyVal),
    asyncHandler(getCompany)
)

// Search for a company with a name
companyRouter.get('/search-company',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR, roles.USER]),
    isValid(searchCompanyByNameVal),
    asyncHandler(searchCompanyByName)
)

// Get all applications for specific Job
companyRouter.get('/job-applications/:jobId',
    isAuthenticated(),
    isAuthorized([roles.COMPANY_HR]),
    isValid(getApplicationJobVal),
    asyncHandler(getApplicationJob)
)

export default companyRouter;