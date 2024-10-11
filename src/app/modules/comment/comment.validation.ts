import { z } from "zod";

const createCommentValidation = z.object({
  body: z.object({
    userId: z.string({ required_error: "User id is required" }),
    recipeId: z.string().min(1, "recipe ID is required"),
    title: z.string({ required_error: "Title is required" }),
    comment: z.string().min(1, "Comment is required"),
    images: z.array(z.string()).optional(),
  }),
});




export const CommentValidation = {
  createCommentValidation,
};
