import { Types } from "mongoose";

export interface TBlog {
  user: Types.ObjectId;
  blogCategory: string;
  
  title: string;
  description: string;
  image: string;
}
