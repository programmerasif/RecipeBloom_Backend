import { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema = new Schema<TCategory>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  categoryDescription: { type: String, required: true },
});

export const Category = model("Category", categorySchema);
