import { Company } from "../../../DB/index.js";
import { APPError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messaeges.js";

// add company 
export const addCompany = async (req, res, next) => {
    // get data from req
    let { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    companyName = companyName.toLowerCase()
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
        companyHR: req.authUser._id
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
    // send res
    return res.status(200).json({
        message: messages.company.deleted,
        success: true
    })
}

// get Company             todo return all jobs related to this company
export const getCompany = async (req, res, next) => {
    // get data from req
    const { companyId } = req.params;
    // check existence
    const companyExist = await Company.findById(companyId)
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