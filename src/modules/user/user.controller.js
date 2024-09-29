import { User } from "../../../DB/index.js";
import { APPError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messaeges.js";

// update user
export const updateUser = async (req, res, next) => {
    // get data from req
    const { userId } = req.params;
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;
    const authUserId = req.authUser._id;
    // check user exist 
    const userExist = await User.findById(userId);
    if (!userExist) {
        return next(new APPError(messages.user.notExist, 404));
    }
    // check only the owner of the account can update his account data
    if (authUserId.toString() !== userId.toString()) {
        return next(new APPError(messages.user.unauthorized, 401));
    }
    // Check if email, mobile number, or recovery email already exists for another user
    const existingUser = await User.findOne({
        $or: [
            { email: email },
            { mobileNumber: mobileNumber },
            { recoveryEmail: recoveryEmail }
        ],
        _id: { $ne: authUserId }
    });

    if (existingUser) {
        return next(new APPError(messages.user.alreadyExist, 409));
    }
    // prepare data
    userExist.email = email || userExist.email
    userExist.mobileNumber = mobileNumber || userExist.mobileNumber
    userExist.recoveryEmail = recoveryEmail || userExist.recoveryEmail
    userExist.DOB = DOB || userExist.DOB
    userExist.lastName = lastName || userExist.lastName
    userExist.firstName = firstName || userExist.firstName
    // add to db
    const userUpdated = await userExist.save();
    // handel fail
    if (!userUpdated) {
        return next(new APPError(messages.user.failToUpdate, 500))
    }
    // send res 
    return res.status(200).json({
        message: messages.user.updated,
        success: true,
        data: userUpdated
    })
}
