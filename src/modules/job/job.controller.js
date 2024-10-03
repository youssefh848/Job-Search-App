import { Application, Company, Job } from "../../../DB/index.js";
import { ApiFeature } from "../../utils/apiFeatuers.js";
import { APPError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloud.js";
import { messages } from "../../utils/constant/messaeges.js";

// add job
export const addJob = async (req, res, next) => {
    // get data from req
    let {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    } = req.body;
    jobTitle = jobTitle.toLowerCase();
    // check if the user has a company
    const company = await Company.findOne({ companyHR: req.authUser._id });
    if (!company) {
        return next(new APPError(messages.company.notExist, 404));
    }
    // check existance
    const existingJob = await Job.findOne({
        jobTitle,
        addedBy: req.authUser._id // only check jobs created by the current user
    });

    if (existingJob) {
        return next(new APPError(messages.job.alreadyExist, 409));
    }
    // prepare data 
    const job = new Job({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills: JSON.parse(technicalSkills),
        softSkills: JSON.parse(softSkills),
        addedBy: req.authUser._id,
        company: company ? company._id : null
    })
    // add to db 
    const createdJob = await job.save()
    // handel fail 
    if (!createdJob) {
        return next(new APPError(messages.job.failToCreate, 500))
    }
    // send res
    return res.status(201).json({
        message: messages.job.created,
        success: true,
        data: createdJob
    })
}

// update job
export const updateJob = async (req, res, next) => {
    // get data from req
    const { jobId } = req.params;
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    } = req.body;
    const authUserId = req.authUser._id;
    // check existence
    const jobExist = await Job.findById(jobId)
    if (!jobExist) {
        return next(new APPError(messages.job.notExist, 404))
    }
    // check if the user is the owner of the job
    if (jobExist.addedBy.equals(authUserId)) {
        return next(new APPError(messages.user.unauthorized, 403))
    }
    // prepare data
    jobExist.jobTitle = jobTitle || jobExist.jobTitle;
    jobExist.jobLocation = jobLocation || jobExist.jobLocation;
    jobExist.workingTime = workingTime || jobExist.workingTime;
    jobExist.seniorityLevel = seniorityLevel || jobExist.seniorityLevel;
    jobExist.jobDescription = jobDescription || jobExist.jobDescription;
    jobExist.technicalSkills = technicalSkills || jobExist.technicalSkills;
    jobExist.softSkills = softSkills || jobExist.softSkills;
    // update db
    const updateJob = await jobExist.save()
    // handel fail
    if (!updateJob) {
        return next(new APPError(messages.job.failToUpdate, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.job.updated,
        success: true,
        data: updateJob
    })
}

// delete job
export const deleteJob = async (req, res, next) => {
    // get data from req
    const { jobId } = req.params;
    const authUserId = req.authUser._id;
    // check existance
    const jobExist = await Job.findById(jobId)
    if (!jobExist) {
        return next(new APPError(messages.job.notExist, 404))
    }
    // check if the user is the owner of the job
    if (jobExist.addedBy.equals(authUserId)) {
        return next(new APPError(messages.user.unauthorized, 403))
    }
    // delete job
    const jobDeleted = await Job.findByIdAndDelete(jobId)
    // handel fail
    if (!jobDeleted) {
        return next(new APPError(messages.job.failToDelete, 500))
    }
    // Delete related application on this job
    await Application.deleteMany({ jobId })
    // send res
    return res.status(200).json({
        message: messages.job.deleted,
        success: true
    })
}

// Get all Jobs with their company’s information.
export const getAllJobs = async (req, res, next) => {
    // get jobs from db
    const apiFeature = new ApiFeature(Job.find().populate('company'), req.query).pagination().sort().select().filter()
    const jobs = await apiFeature.mongooseQuery
    // handel fail
    if (jobs.length == 0) {
        return next(new APPError(messages.job.notExist, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.job.fetchedSuccessfully,
        success: true,
        data: jobs
    })

}

// get jobs for a specific company
export const getJobsByCompany = async (req, res, next) => {
    // get data from req
    let { companyName } = req.query;
    companyName = companyName.toLowerCase()
    // serch by name
    const companyExist = await Company.findOne({ companyName })
    if (!companyExist) {
        return next(new APPError(messages.company.notExist, 404))
    }
    const jobs = await Job.find({ company: companyExist._id }).populate('addedBy', 'username')
    // send res
    return res.status(200).json({
        success: true,
        data: jobs
    })
}

// apply job
export const applyJob = async (req, res, next) => {
    // Get data from req 
    const { jobId } = req.params;
    const userId = req.authUser._id;
    const { userTechSkills, userSoftSkills } = req.body;

    // Check job existence
    const jobExist = await Job.findById(jobId);
    if (!jobExist) {
        return next(new APPError(messages.job.notExist, 404));
    }

    // Check if the user has already applied to this job
    const userApplied = await Application.findOne({ userId, jobId });
    if (userApplied) {
        return next(new APPError(messages.job.alreadyApplied, 400));
    }

    // Upload file
    if (!req.file) {
        return next(new APPError(messages.file.required, 400));
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: '/Job Search App/resume'
    })

    // Handle upload fail
    req.failResume = { secure_url, public_id };

    // Prepare data
    const application = new Application({
        jobId,
        userId,
        userTechSkills: JSON.parse(userTechSkills),
        userSoftSkills: JSON.parse(userSoftSkills),
        userResume: { secure_url, public_id }
    });

    // Add to db
    const createdApplication = await application.save();

    // Handle fail
    if (!createdApplication) {
        return next(new APPError(messages.job.failToApply, 500));
    }

    // Send response
    return res.status(201).json({
        message: messages.job.createdApplication,
        success: true,
        data: createdApplication
    })
}

