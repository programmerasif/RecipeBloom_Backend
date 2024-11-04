import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const findUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.findUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserById(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is updated successfully",
    data: result,
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.deleteUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is deleted successfully",
    data: result && null,
  });
});
const toggleStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.toggleStatus(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ToggleStatus successfully",
    data: result && null,
  });
});
const promoteToAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.promoteToAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "PromoteToAdmin successfully",
    data: result && null,
  });
});
const promoteToPremium = catchAsync(async (req, res) => {
 
  const { id } = req.params;

  
  const result = await UserService.promoteToPremium(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "promote To Premium account successfully",
    data: result ,
  });
});

const followUser = catchAsync(async (req, res) => {
  const { userId, targetUserId } = req.body;
  const result = await UserService.followUser(userId, targetUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

const unFollowUser = catchAsync(async (req, res) => {
  const { userId, targetUserId } = req.body;
  const result = await UserService.unFollowUser(userId, targetUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User unFollowed successfully",
    data: result,
  });
});
const getFollowersById = catchAsync(async (req, res) => {
  const {id } = req.params;
  const result = await UserService.getFollowersByIdDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Followers successfully",
    data: result,
  });
});
const getFollowingsById = catchAsync(async (req, res) => {
  const {id } = req.params;
  const result = await UserService.getFollowingByIdDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Following successfully",
    data: result,
  });
});
const updatePasswordByEmail = catchAsync(async (req, res) => {
  console.log("Request body:", req.body);  
  const result = await UserService.updatePasswordByEmailDB(req?.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Update successfully",
    data: result,
  });
});


export const UserController = {
  findUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  toggleStatus,
  promoteToAdmin,
  unFollowUser,
  followUser,
  promoteToPremium,
  getFollowersById,
  getFollowingsById,
  updatePasswordByEmail
};
