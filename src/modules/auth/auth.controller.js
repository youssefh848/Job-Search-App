import bcrypt from "bcrypt";
import { User } from "../../../DB/index.js"
import { APPError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messaeges.js"
import { generateToken, verifyToken } from "../../utils/token.js";
import { sendEmail } from "../../utils/email.js";
import { status } from "../../utils/constant/enums.js";
import { generateOTP, sendOTP } from "../../utils/OTP.js";

// signup
export const signup = async (req, res, next) => {
    // get data from req 
    let { firstName, lastName, email, password, mobileNumber, recoveryEmail, DOB } = req.body
    // check existence 
    const userExistence = await User.findOne({ $or: [{ email }, { mobileNumber }] })
    if (userExistence) {
        return next(new APPError(messages.user.alreadyExist, 409))
    }
    // prepare data
    // --hash password
    password = bcrypt.hashSync(password, 8)
    // --create user
    const user = new User({
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        recoveryEmail,
        DOB
    })
    // add to db
    const userCreated = await user.save()
    // handel fail
    if (!userCreated) {
        return next(new APPError(messages.user.failToCreate, 500))
    }
    // genreate token 
    const token = generateToken({ payload: { email } })
    // send email
    await sendEmail({
        to: email,
        subject: "verify your account",
        html: `<p>Click on the link to verify your account: <a href="${req.protocol}://${req.headers.host}/auth/verify/${token}">Verify Account</a></p>`

    })
    // send res
    return res.status(201).json({
        message: messages.user.created,
        success: true,
        data: userCreated
    })

}

// verify account
export const verifyAccount = async (req, res, next) => {
    // get data from req
    const { token } = req.params;
    // check token
    const payload = verifyToken({ token })
    await User.findOneAndUpdate({ email: payload.email, verified: false }, { verified: true })
    // send res
    return res.status(200).json({ message: messages.user.verified, success: true })
}

// login
export const login = async (req, res, next) => {
    // get data from req
    const { email, mobileNumber, recoveryEmail, password } = req.body
    // check user exist and update status online
    const userExist = await User.findOneAndUpdate(
        { $or: [{ email }, { mobileNumber }, { recoveryEmail }] },
        { status: status.ONLINE },
        { new: true }
    );
    if (!userExist) {
        return next(new APPError(messages.user.invalidCredntiols, 401))
    }
    // check password
    const isMatch = bcrypt.compareSync(password, userExist.password)
    if (!isMatch) {
        return next(new APPError(messages.user.invalidCredntiols, 401))
    }
    // check if user is verified
    if (!userExist.verified) {
        return next(new APPError(messages.user.notVerified, 401))
    }
    // genrate token
    const token = generateToken({ payload: { _id: userExist._id, email: userExist.email } })
    // send res 
    return res.status(200).json({
        message: messages.user.loginSuccessfully,
        success: true,
        token
    })
}

// forget password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new APPError(messages.user.invalidCredntiols, 401));
    }
    const otp = generateOTP(); // Function to generate OTP
    await sendOTP(user.email, otp); // Send OTP via email
    user.otp = otp; // Save OTP to user record
    user.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();
    return res.status(200).json({ message: 'OTP sent to your email', success: true });
};