import { Types } from "mongoose";

export interface TRecipe {
  user: Types.ObjectId;
  name: string;
  description: string;
  ingredients: { name: string }[];
  readyIn: number;
  recipeImage: string;
  category: "Breakfast" | "Dinner" | "Lunch";
  foodCategory: Types.ObjectId;
  isVegetarian: boolean;
  totalPeople?: number;
  comments: string[];
  likes: Types.ObjectId[];
  disLikes: Types.ObjectId[];
  rating: {
    userId: Types.ObjectId;
    ratingNumber: number;
  }[];
  totalAverageRating: number;
  isPublished: boolean;
  isPremium: boolean;
  isDeleted: boolean;
}
export interface TRating {
  userId: Types.ObjectId;
  ratingNumber: number;
}
