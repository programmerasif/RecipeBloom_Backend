import { Router } from 'express';
import { CategoryControllers } from './category.controller';
import { CategoryValidation } from './category.validation';
import validateRequest from '../../middlewares/validateRequest';

const route = Router();

route.post(
  '/',
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);
route.get("/", CategoryControllers.getAllCategory);
route.get("/:id", CategoryControllers.getSingleCategory);
route.patch("/:id", CategoryControllers.updateCategory);
route.delete("/:id", CategoryControllers.deleteCategory);

export const CategoryRoutes = route;
