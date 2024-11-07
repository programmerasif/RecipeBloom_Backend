import httpStatus from "http-status";

import AppError from "../../errors/AppError";
// import { Comment } from "../comment/comment.model";
import { User } from "../User/user.model";

import { TRating, TRecipe } from "./recipe.interface";
import { Recipe } from "./recipe.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Comment } from "../comment/comment.model";

const createRecipe = async (payload: Partial<TRecipe>) => {
if(!payload.user){
  throw new AppError(httpStatus.BAD_REQUEST, "User Id is required");
}
const user = await User.findById(payload.user);
if (!user) {
  throw new AppError(404, "User not found");
}

  const res = await Recipe.create(payload);

if(res){
  await User.findByIdAndUpdate(payload.user,{ $push: { recipePublished: res._id } });
}

  return res;
};

const getAllRecipe = async (query: Record<string, unknown>) => {
  if (query?.category) {
    query.category = (query.category as string).split(",");
  }

  const recipeQuery = new QueryBuilder(
    Recipe.find({ isDeleted: false }).populate(["user", "foodCategory"]),
    query,
  )
    .search(["name", ])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();
  return { result, meta };
};
const getRecipeForUser = async (id: string, query: Record<string, unknown>) => {
  if (query?.category) {
    query.category = (query.category as string).split(",");
  }

  const recipeQuery = new QueryBuilder(
    Recipe.find({ isDeleted: false, user: id }).populate([
      "user",
      "foodCategory",
    ]),
    query,
  )
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await recipeQuery.modelQuery;
  const meta = await recipeQuery.countTotal();
  
  const hasMore = meta?.totalPage > meta?.page
  
  return { result, meta ,hasMore};
};
const getSingleRecipe = async (id: string, query: Record<string, unknown>) => {
  const recipeQuery = new QueryBuilder(
    Recipe.find({ isDeleted: false, _id: id }).populate([
      "user",
      "foodCategory",
    ]),
    query,
  )

    .sort()

    .fields();
  const result = await recipeQuery.modelQuery;

  return result[0];
};
const updateRecipe = async (id: string, payload: Partial<TRecipe>) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    throw new AppError(404, "Recipe not found");
  }
  const result = await Recipe.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const deleteRecipe = async (id: string) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    throw new AppError(404, "Recipe not found");
  }

  const result = await Recipe.findByIdAndDelete(id, { new: true });
  if (result) {
    await Comment.deleteMany({ recipeId: id });
  }
  return result;
};

  const togglePublishStatus = async (id: string) => {
   
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      throw new AppError(404, "Recipe not found");
    }

    recipe.isPublished = !recipe.isPublished;
    const result = await recipe.save();
    return result;
  };


  const createRating = async (recipeId: string, payload: TRating) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid Recipe Id");
    }
  
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid User Id");
    }
  
    // Check if user has already rated this recipe
    const existingRating = recipe.rating.find(
      (rating) => rating.userId.toString() === payload.userId.toString()
    );
  
    if (existingRating) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Rating from this user already exists."
      );
    }
  
    // Add the new rating
    recipe.rating.push(payload);
  
    // Recalculate the average rating
    const totalRatings = recipe.rating.length;
    const ratingSum = recipe.rating.reduce(
      (acc, rating) => acc + rating.ratingNumber,
      0
    );
    recipe.totalAverageRating = parseFloat((ratingSum / totalRatings).toFixed(1));
  
    // Save the updated recipe
    const result = await recipe.save();
    return result;
  };
export const RecipeServices = {
  createRecipe,
  getAllRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  togglePublishStatus,
  createRating,
  getRecipeForUser,
};
