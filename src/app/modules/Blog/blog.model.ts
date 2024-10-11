import { model, Schema } from "mongoose";
import { TBlog } from "./blog.interface";
import { foodBlogCategories } from "./blog.constant";

const BlogSchema: Schema = new Schema<TBlog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    blogCategory: { type: String, required: true,enum:foodBlogCategories },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export const Blog = model<TBlog>("Blog", BlogSchema);
