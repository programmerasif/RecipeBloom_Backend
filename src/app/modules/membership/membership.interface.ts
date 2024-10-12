import { Types } from "mongoose";

export interface TMembership {
  user: Types.ObjectId;
  name: string;
  description: string;
  ingredients: { name: string }[];
  readyIn: number;
  recipeImage: string;
  foodCategory: string;
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