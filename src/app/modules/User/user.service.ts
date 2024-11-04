/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";

import { UserSearchableFields } from "./user.constant";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { initialPayment } from "../../Payment/Payment.utils";
import bcrypt from "bcrypt";

const findUserById = async (userId: string) => {
  return await User.findById(userId);
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const metaData = await userQuery.countTotal();
  return {
    meta: metaData,
    data: result,
  };
};

const updateUserById = async (userId: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteUserById = async (userId: string) => {
  const result = await User.findByIdAndDelete(userId);
  return result;
};

const toggleStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user) {
    user.isBlocked = !user.isBlocked;
    user.save();
  }

  return user;
};
const promoteToAdmin = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role: "admin", isBlocked: false, isPremium: true },
    { new: true },
  );

  return user;
};
const promoteToPremium = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false, isPremium: true },
    { new: true },
  );
  const paymentLink = initialPayment({
    customerName: user?.name,
    customerEmail: user?.email,
    customerPhone: "01721XXXXXXXX",
  });

  return paymentLink;
};

const followUser = async (
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId,
) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(404, "User not found");
  }

  if (!user.following.includes(targetUserId)) {
    user.following.push(targetUserId);
    targetUser.followers.push(userId);
    await user.save();
    await targetUser.save();
  }

  return user;
};

const unFollowUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(404, "User not found");
  }

  user.following = user.following.filter(
    (id) => id.toString() !== targetUserId,
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== userId,
  );
  await user.save();
  await targetUser.save();

  return user;
};

const getFollowersByIdDB = async (id: string) => {
  const user = await User.findById(id).populate("followers");

  return user?.followers;
};
const getFollowingByIdDB = async (id: string) => {
  const user = await User.findById(id).populate("following");
  return user?.following;
};
const updatePasswordByEmailDB = async (payload: any) => {
  const { email, oldPassword, newPassword } = payload;

 


  const user = await User.findOne({email});
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!isMatch) {
    throw new AppError(400, "Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return user;
};
export const UserService = {
  findUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  toggleStatus,
  promoteToAdmin,
  followUser,
  unFollowUser,
  promoteToPremium,
  getFollowersByIdDB,
  getFollowingByIdDB,
  updatePasswordByEmailDB,
};
