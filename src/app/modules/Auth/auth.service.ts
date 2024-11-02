/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";

import bcryptJs from "bcryptjs";
import { User } from "../User/user.model";
import { USER_ROLE } from "../User/user.utils";
import { TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import nodemailer from "nodemailer"; 
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist

  const user = await User.findOne({ email: payload.email });

  if (!user?.password && payload.password) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Please login with google!");
  }

  if (user && user.password) {
    const isPasswordMatched = await bcryptJs.compare(
      payload?.password as string,
      user.password!,
    );

    if (!isPasswordMatched) {
      throw new AppError(httpStatus.NOT_FOUND, "Password Incorrect!");
    }
  }

  if (!user) {
    const user = await registerUser(payload);

    const jwtPayload = {
      email: user.email,
      role: user.role,
      mongoId: user._id,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  } else {
    if (payload.password && user.password) {
      const isPasswordMatched = await bcryptJs.compare(
        payload.password,
        user.password!,
      );

      if (!isPasswordMatched) {
        throw new AppError(httpStatus.NOT_FOUND, "Password Incorrect!");
      }
    }
    const jwtPayload = {
      email: user.email,
      role: user.role,
      mongoId: user._id,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
    mongoId: user._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const registerUser = async (userData: TLoginUser) => {
  const userInfo = await User.findOne({ email: userData.email });
  if (userInfo) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already exist");
  }
  if (userData.password) {
    userData.password = await bcryptJs.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  const user = await User.create({
    ...userData,
    role: USER_ROLE.user,
  });

  return user;
};

const forgetPasswordIntoDB =  async (to: any, resetToken: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset',
    text: `Please use the following link to reset your password: ${resetLink}`,
    html: `<p>Please use the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
  
};


export const AuthServices = {
  loginUser,
  refreshToken,
  registerUser,
  forgetPasswordIntoDB
};
