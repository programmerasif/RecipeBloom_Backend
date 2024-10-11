import { Types } from "mongoose";

export interface TBlog {
  user: Types.ObjectId;
  blogCategory: string;
  isPremium:boolean;
  title: string;
  description: string;
  image: string;
}
