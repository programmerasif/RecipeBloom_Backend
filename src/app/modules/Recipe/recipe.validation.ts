import { Types } from "mongoose";
import { z } from "zod";

const ingredientsSchema = z.object({
  name: z.string().nonempty("Ingredient name is required"),
});

const CreateRecipeValidationSchema = z.object({
  body: z.object({
    user: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid user ID",
    }),
    ingredients: z.array(ingredientsSchema).default([]),
    readyIn: z.number().min(1, "Ready time must be at least 1 minute"),
    name: z.string().nonempty("Recipe name is required"),
    isPremium: z.boolean().optional(),
    foodCategory: z.string().nonempty("Food type is required"),
    isVegetarian: z.boolean(),
    totalPeople: z.number().optional(),
    description: z.string().nonempty("Description is required"),
    recipeImage: z.string().url("Recipe image must be a valid URL"),
    category: z.enum(["Breakfast", "Dinner", "Lunch"]),
    disLikes: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid user ID",
        }),
      )
      .default([]),
    likes: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid user ID",
        }),
      )
      .default([]),
    comments: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid comment ID",
        }),
      )
      .optional(),
    rating: z
      .array(
        z.object({
          userId: z.string().refine((val) => Types.ObjectId.isValid(val), {
            message: "Invalid user ID",
          }),
          ratingNumber: z
            .number()
            .min(1)
            .max(5, "Rating must be between 1 and 5")
            .default(1),
        }),
      )
      .default([]),
    totalAverageRating: z
      .number()
      .min(1, "Average rating must be at least 1")
      .default(1),
  }),
});

export const RecipeValidationSchema = {
  CreateRecipeValidationSchema,
};
