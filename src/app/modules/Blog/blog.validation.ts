import { z } from 'zod';
import { foodBlogCategories } from './blog.constant';

const BlogValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User Id is required' }).min(2).max(255),
    blogCategory: z.enum(foodBlogCategories as [string, ...string[]]),
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    image: z.string({ invalid_type_error: 'Invalid  type' }),
    isPremium: z.boolean({ invalid_type_error: 'Invalid  type' }).optional(),
  }),
});

export const BlogValidation = {
  BlogValidationSchema,
};
