import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { User } from "../User/user.model";
import { generateResetToken, verifyResetToken } from "../../utils/passToken";
import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, user } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully!",
    data: result,
  });
});
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  console.log(email);
  if (!email) return res.status(404).json({ message: 'Email are not send ' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = await generateResetToken(user._id);
    await AuthServices.forgetPasswordIntoDB(user.email, resetToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "",
    data: '',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;


  const user = await verifyResetToken(token);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS));

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // Respond to the client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password has been reset successfully.",
    data: undefined
  });
});
export const AuthControllers = {
  loginUser,
  refreshToken,
  registerUser,
  forgetPassword,
  resetPassword
};
