import xlsx from 'xlsx';
import { Application, Company, Job } from "../../../DB/index.js";
import { APPError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messaeges.js";

// add company 
export const addCompany = async (req, res, next) => {
    // get data from req
    let { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    companyName = companyName.toLowerCase()
    const companyHR = req.authUser._id
    // check if the user already has a company
    const existingCompany = await Company.findOne({ companyHR });
    if (existingCompany) {
        return next(new APPError(messages.company.userHaveCompany, 409));
    }
    // check existance
    const companyExist = await Company.findOne({ companyName });
    if (companyExist) {
        return next(new APPError(messages.company.alreadyExist, 409))
    }
    // prepare data
    const company = new Company({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR
    })
    // add to db 
    const createdCompany = await company.save()
    // handel fail
    if (!createdCompany) {
        return next(new APPError(messages.company.failToCreate, 500))
    }
    // send res
    return res.status(201).json({
        message: messages.company.created,
        success: true,
        data: createdCompany
    })
}

// update Company
export const updateCompany = async (req, res, next) => {
    // get data from req
    let { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    const { companyId } = req.params;
    const authUserId = req.authUser._id;
    companyName = companyName.toLowerCase()
    // check existence
    const companyExist = await Company.findById(companyId);
    if (!companyExist) {
        return next(new APPError(messages.company.notExist, 404));
    }
    // check if the user is the owner of the company
    if (!companyExist.companyHR.equals(authUserId)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // check name existane
    const nameExist = await Company.findOne({ companyName, _id: { $ne: companyId } })
    if (nameExist) {
        return next(new APPError(messages.company.alreadyExist, 409))
    }
    // prepare data
    companyExist.companyName = companyName || companyExist.companyName;
    companyExist.description = description || companyExist.description;
    companyExist.industry = industry || companyExist.industry;
    companyExist.address = address || companyExist.address;
    companyExist.numberOfEmployees = numberOfEmployees || companyExist.numberOfEmployees;
    companyExist.companyEmail = companyEmail || companyExist.companyEmail;
    // save the updated company
    const updatedCompany = await companyExist.save();
    // handle fail
    if (!updatedCompany) {
        return next(new APPError(messages.company.failToUpdate, 500));
    }
    // send res
    return res.status(200).json({
        message: messages.company.updated,
        success: true,
        data: updatedCompany
    });
}

// delete company 
export const deleteCompany = async (req, res, next) => {
    // get data from req
    const { companyId } = req.params;
    const authUserId = req.authUser._id;
    // check existence
    const companyExist = await Company.findById(companyId)
    if (!companyExist) {
        return next(new APPError(messages.company.notExist, 404))
    }
    // check if the user is the owner of the company
    if (!companyExist.companyHR.equals(authUserId)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // delete the company
    const deletedCompany = await Company.findByIdAndDelete(companyId);
    if (!deletedCompany) {
        return next(new APPError(messages.company.failToDelete, 500));
    }
    // Delete related jobs on this company
    await Job.deleteMany({ company: companyId });
    // send res
    return res.status(200).json({
        message: messages.company.deleted,
        success: true
    })
}

// get Company             
export const getCompany = async (req, res, next) => {
    // get data from req
    const { companyId } = req.params;
    // check existence
    const companyExist = await Company.findById(companyId)
    if (!companyExist) {
        return next(new APPError(messages.company.notExist, 404))
    }
    // Get all jobs related to this company
    const jobs = await Job.find({ company: companyId }).populate('company')
    // send res
    return res.status(200).json({
        message: messages.company.fetchedSuccessfully,
        success: true,
        data: jobs
    })
}

// Search for a company with a name
export const searchCompanyByName = async (req, res, next) => {
    // get data from req
    const { companyName } = req.query;
    // search for company
    const companyExist = await Company.findOne({ companyName: companyName.toLowerCase() });
    if (!companyExist) {
        return next(new APPError(messages.company.notExist, 404))
    }
    // send res
    return res.status(200).json({
        message: messages.company.fetchedSuccessfully,
        success: true,
        data: companyExist
    })
}

// Get all applications for specific Job
export const getApplicationJob = async (req, res, next) => {
    // get data from req
    const { jobId } = req.params;
    const userId = req.authUser._id;
    // cheke jobExist
    const jobExist = await Job.findById(jobId).populate('company')
    if (!jobExist) {
        return next(new APPError(messages.job.notExist, 404))
    }
    // ensure that the HR owns this job
    if (!jobExist.company.companyHR.equals(userId)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // all applications for this job
    const applications = await Application.find({ jobId }).populate('userId', '-password -__v -createdAt -updatedAt')
    // Check if there are applications
    if (applications.length === 0) {
        return next(new APPError(messages.application.notExist, 404))
    }
    // send res
    return res.status(200).json({
        message: messages.application.fetchedSuccessfully,
        success: true,
        data: applications
    })
}

// getApplicationsReport
export const getApplicationsReport = async (req, res, next) => {
    // get data from req
    const { companyId, date } = req.query;
    const userId = req.authUser._id;
    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new APPError(messages.company.notExist, 404));
    }
    // check if the user is the owner of the company
    if (!company.companyHR.equals(userId)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // Fetch jobs for the company
    const jobs = await Job.find({ company: companyId });
    if (!jobs.length) {
        return next(new APPError(messages.job.notExist, 404));
    }

    // Get all jobIds for the company
    const jobIds = jobs.map(job => job._id);

    // Fetch applications for the company jobs on the specified day
    const applications = await Application.find({
        jobId: { $in: jobIds }, // Match any jobId from the company
        createdAt: {
            $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            $lte: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
    }).populate('userId', 'firstName lastName email')
        .populate('jobId', 'jobTitle')
    // Check if there are applications
    if (!applications.length) {
        return next(new APPError('No applications found on the specified day', 404));
    }
    // Convert data into a format suitable for Excel
    const data = applications.map(application => ({
        'User Name': `${application.userId.firstName} ${application.userId.lastName}`,
        'Email': application.userId.email,
        'Applied Job Title': application.jobId.jobTitle,
        'Application Date': application.createdAt.toDateString(),
        'User Resume': application.userResume.secure_url
    }));
    // Create Excel file using xlsx library
    const worksheet = xlsx.utils.json_to_sheet(data); // Convert JSON data to a worksheet
    const workbook = xlsx.utils.book_new(); // Create a new workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Applications'); // Append the worksheet to the workbook
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
    // Send the file
    const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(excelBuffer);
}