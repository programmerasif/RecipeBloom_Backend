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
    .search(["name", "description"])
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
  return { result, meta };
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
  const RecipeData = await Recipe.findById(recipeId);
  if (!RecipeData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Recipe Id");
  }
  const userData = await User.findById(payload.userId);
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user Id");
  }

  const ratingData = RecipeData.rating;

  const existingRating = ratingData.find(
    (rating) => rating.userId === payload.userId,
  );

  if (existingRating) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating from this user already exists.",
    );
  }

  if (ratingData.length === 0) {
    RecipeData.totalAverageRating = payload.ratingNumber;

    RecipeData.rating.push(payload);
  } else {
    RecipeData.rating.push(payload);

    // Proceed with average recalculation if there are existing ratings
    const totalRatings = RecipeData.rating.length;

    const ratingSum = RecipeData.rating.reduce(
      (acc, rating) => acc + rating.ratingNumber,
      0,
    );

    // Update individual average ratings
    RecipeData.totalAverageRating = parseFloat(
      (ratingSum / totalRatings).toFixed(1),
    );
  }

  // Save the updated recipe

  const result = await RecipeData.save();
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
