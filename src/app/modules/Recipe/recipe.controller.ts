import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import { RecipeServices } from "./recipe.service";

const createRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.createRecipe(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe is created successfully",
    data: result,
  });
});
const getAllRecipe = catchAsync(async (req, res) => {
  const { meta, result } = await RecipeServices.getAllRecipe(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe retrieved successfully",
    data: result,
    meta: meta,
  });
});
const getRecipeForUser = catchAsync(async (req, res) => {
  const { meta, result } = await RecipeServices.getRecipeForUser(
    req.params.userId,
    req?.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe For User retrieved successfully",
    data: result,
    meta: meta,
  });
});
const getSingleRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.getSingleRecipe(req.params.id, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe retrieved successfully",
    data: result,
  });
});
const deleteRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.deleteRecipe(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe deleted successfully",
    data: result,
  });
});
const togglePublishStatus = catchAsync(async (req, res) => {
  const result = await RecipeServices.togglePublishStatus(req.params.recipeId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "toggle Publish Status Recipe  successfully",
    data: result,
  });
});

const updateRecipe = catchAsync(async (req, res) => {
  const result = await RecipeServices.updateRecipe(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recipe updated successfully",
    data: result,
  });
});
const createRating = catchAsync(async (req, res) => {
  const result = await RecipeServices.createRating(
    req.params.recipeId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rating added successfully",
    data: result,
  });
});

export const RecipeControllers = {
  createRecipe,
  getAllRecipe,
  getSingleRecipe,
  deleteRecipe,
  updateRecipe,

  createRating,
  getRecipeForUser,
  togglePublishStatus,
};
