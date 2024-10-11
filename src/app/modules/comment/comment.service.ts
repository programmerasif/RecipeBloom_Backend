import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { User } from "../User/user.model";
import mongoose from "mongoose";

import { Recipe } from "../Recipe/recipe.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createComment = async (payload: Partial<TComment>) => {
  const {
recipeId
   
  } = payload;

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
      { new: true, session }
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
      "Failed to create comment"
    );
  }
};

const getCommentForRecipe = async (
  recipeId: string,
  query: Record<string, unknown>
) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError(404, "Invalid package Id");
  }

  const recipeComment = new QueryBuilder(
    Comment.find({ recipeId:recipeId }).populate(["userId"]),
    query
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



export const CommentServices = {
  createComment,
  getCommentForRecipe,

};
