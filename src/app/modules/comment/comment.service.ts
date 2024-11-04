/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { User } from "../User/user.model";
import mongoose, { Types } from "mongoose";

import { Recipe } from "../Recipe/recipe.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createComment = async (payload: Partial<TComment>) => {
  const { recipeId } = payload;

  const recipeData = await Recipe.findById(recipeId);
  const userData = await User.findById(payload.userId);

  if (!recipeData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid recipe Id");
  }
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user Id");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newComment] = await Comment.create([{ ...payload }], { session });

    await Recipe.findByIdAndUpdate(
      recipeId,
      { $push: { comments: newComment._id } },
      { new: true, session },
    );
    await session.commitTransaction();
    session.endSession();

    return newComment;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create comment",
    );
  }
};
const updateCommentIntoBD = async (payload: Partial<any>) => {
  const { updateText,commentId } = payload;

  const comment = await Comment.findById(commentId);
  comment!.comment = updateText
  await comment!.save();
return comment
};

const deleteCommentFromDB = async (commentId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  await comment.deleteOne();
  return { success: true, message: "Comment deleted successfully" };
};

const getCommentForRecipe = async (
  recipeId: string,
  query: Record<string, unknown>,
) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError(404, "Invalid Recipe Id");
  }

  const recipeComment = new QueryBuilder(
    Comment.find({ recipeId: recipeId }).populate(["userId"]),
    query,
  )
    .search(["comment,title"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await recipeComment.modelQuery;
  const meta = await recipeComment.countTotal();
  return { result, meta };
};

const createLike = async (payload: { recipeId: string; userId: string }) => {
  const { recipeId, userId } = payload;

  const userObjectId = new Types.ObjectId(userId);

  const recipeData = await Recipe.findById(recipeId);
  if (!recipeData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid recipe ID");
  }

  const hasLiked = recipeData.likes.includes(userObjectId);

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    hasLiked
      ? { $pull: { likes: userObjectId } }
      : { $addToSet: { likes: userObjectId } },
    { new: true },
  );

  return updatedRecipe;
};
const createDislike = async (payload: { recipeId: string; userId: string }) => {
  const { recipeId, userId } = payload;

  const userObjectId = new Types.ObjectId(userId);

  const recipeData = await Recipe.findById(recipeId);
  if (!recipeData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid recipe ID");
  }

  const hasDisliked = recipeData.disLikes.includes(userObjectId);

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    hasDisliked
      ? { $pull: { disLikes: userObjectId } }
      : { $addToSet: { disLikes: userObjectId } },
    { new: true },
  );

  return updatedRecipe;
};


export const CommentServices = {
  createComment,
  getCommentForRecipe,
  createLike,
  createDislike,
  updateCommentIntoBD,
  deleteCommentFromDB
};
