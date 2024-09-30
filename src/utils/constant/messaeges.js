
const generateMessage = (entity) => ({
    alreadyExist: `${entity} already exist`,
    notExist: `${entity} not found`,
    created: `${entity} created successfully`,
    failToCreate: `Failed to create ${entity}`,
    updated: `${entity} updated successfully`,
    failToUpdate: `Failed to update ${entity}`,
    deleted: `${entity} deleted successfully`,
    failToDelete: `Failed to delete ${entity}`,
    fetchedSuccessfully: `${entity} fetched successfully`,

})
export const messages = {
    file: { required: 'file is required' },
    user: {
        ...generateMessage('user'),
        verified: "user verified successfully",
        invalidCredntiols: "invalid Credntiols",
        notVerified: "not Verified",
        loginSuccessfully: "login successfully",
        unauthorized: "unauthorized to access this api",
        invalidPassword: "invalid password",
        passwordUpdated: "password updated successfully",
        invalidOTP: "invalid OTP",
        failToUpdatePassword: "fail To Update Password",
        noAccountsFound: "no accounts found",
    },
    company: generateMessage('company')

}