import { Types } from "mongoose";

export interface TComment {
  userId: Types.ObjectId;
  
  recipeId: Types.ObjectId;
  title: string;
 
  comment: string;
 
  images?: string[];
 
}
