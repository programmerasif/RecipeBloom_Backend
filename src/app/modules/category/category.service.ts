import AppError from "../../errors/AppError";
import { Recipe } from "../Recipe/recipe.model";

import { TCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategory = async (payload: TCategory) => {
  const res = await Category.create(payload);
  return res;
};
const deleteCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(404, "Category not found");
  }

  // Remove the category from the Package collection's category array
  await Recipe.updateMany(
    { category: categoryId },
   
  );

  //  delete the category itself
  const res = await Category.findByIdAndDelete(categoryId);
  return res;
};

const getAllCategory = async () => {
  const res = await Category.find();
  return res;
};

const getSingleCategory = async (categoryId: string) => {
  const res = await Category.findById(categoryId);
  return res;
};
const updateCategory = async (
  categoryId: string,
  payload: Partial<TCategory>,
) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const res = await Category.findByIdAndUpdate(categoryId, payload, {
    new: true,
  });
  return res;
};

export const CategoryServices = {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
};
