import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { BlogServices } from "./blog.service";
import sendResponse from "../../utils/sendResponse";

const createBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlog(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog is created successfully",
    data: result,
  });
});

// get all blog
const getAllBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlog(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully",
    data: result,
  });
});

// delete blog using id.......
const deleteBlogWithId = catchAsync(async (req, res) => {
  const blogId = req.params.blogId;

  const result = await BlogServices.deleteSingleBlog(blogId);
  res.status(200).json({
    success: true,
    message: "blog data deleted successfully!",
    data: result,
  });
});
const getSingleBlog = catchAsync(async (req, res) => {
  const blogId = req.params.blogId;
  const result = await BlogServices.getSingleBlog(blogId);
  res.status(200).json({
    success: true,
    message: "blog retrieved successfully!",
    data: result,
  });
});
const updateBlog = catchAsync(async (req, res) => {
  const blogId = req.params.blogId;
  const result = await BlogServices.updateBlog(blogId, req.body);
  res.status(200).json({
    success: true,
    message: "blog updated successfully !",
    data: result,
  });
});
const getBlogByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await BlogServices.getBlogByUser(userId);
  res.status(200).json({
    success: true,
    message: "get Blog By User retrieved successfully !",
    data: result,
  });
});

export const BlogControllers = {
  createBlog,
  getAllBlog,
  deleteBlogWithId,
  getSingleBlog,
  updateBlog,
  getBlogByUser
};
