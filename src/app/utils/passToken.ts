/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../modules/User/user.model";
import crypto from 'crypto';
export const generateResetToken = async (userId:any) => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; 
  
    await User.findByIdAndUpdate(userId, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });
  
    return resetToken;
  };

  export const verifyResetToken = async (token:any) => {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    return user;
  };