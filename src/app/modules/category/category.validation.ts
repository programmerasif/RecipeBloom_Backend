import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name should be string",
    }),
    image: z.string({
      required_error: "Image is required",
      invalid_type_error: "Image should be string",
    }),
    categoryDescription: z.string({
      required_error: "CategoryDescription is required",
      invalid_type_error: "CategoryDescription should be string",
    }),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
};
