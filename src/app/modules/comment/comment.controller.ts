import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentServices } from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const result = await CommentServices.createComment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});
const updateComment = catchAsync(async (req, res) => {
  const result = await CommentServices.updateCommentIntoBD(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});
const deleteComment = catchAsync(async (req, res) => {
  const {commentId} = req.body
  const result = await CommentServices.deleteCommentFromDB(commentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment delete successfully",
    data: result,
  });
});
const getCommentForRecipe = catchAsync(async (req, res) => {

  const {result,meta} = await CommentServices.getCommentForRecipe(
    req.params.id,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment retrieved successfully",
    data: result,
    meta:meta
  });
});
const createLike = catchAsync(async (req, res) => {
  const result = await CommentServices.createLike(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "like given successfully",
    data: result,
  });
});
const createDislike = catchAsync(async (req, res) => {
  const result = await CommentServices.createDislike(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "dislike given successfully",
    data: result,
  });
});

export const CommentControllers = {
  createComment,
  getCommentForRecipe,
  createLike,
  createDislike,
  updateComment,
  deleteComment
};
