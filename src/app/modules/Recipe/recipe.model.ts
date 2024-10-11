import { model, Schema } from "mongoose";
import { TRecipe } from "./recipe.interface";

const ingredientsSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { versionKey: false },
);

const RecipeSchema: Schema = new Schema<TRecipe>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    ingredients: [{ type: ingredientsSchema, default: [] }],
    readyIn: {
      type: Number,
      required: true,
    },
    name: { type: String, required: true },
    foodCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isVegetarian: {
      type: Boolean,
      required: true,
    },
    totalPeople: {
      type: Number,
    },
    isPublished: { type: Boolean, default: true },
    description: { type: String, required: true },

    recipeImage: { type: String, required: true },
    isPremium: { type: Boolean, required: true, default: false },
    category: {
      type: String,
      enum: ["Breakfast", "Dinner", "Lunch"],
      required: true,
    },
    disLikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    rating: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        ratingNumber: { type: Number, required: true, default: 1 },
        _id: false,
      },
    ],
    totalAverageRating: { type: Number, default: 1 },

    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true },
);

export const Recipe = model<TRecipe>("Recipe", RecipeSchema);
