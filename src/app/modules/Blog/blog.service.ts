import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (payload: Partial<TBlog>) => {
  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const res = await Blog.create(payload);
  return res;
};
const getAllBlog = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find().populate('user'), query)
    .search(['blogCategory', 'title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  return result;
};

const deleteSingleBlog = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);

  return result;
};
const getSingleBlog = async (id: string) => {
  const result = await Blog.findById(id).populate('user');

  return result;
};
const getBlogByUser = async (id: string) => {
  const result = await Blog.find({ user: id }).populate('user');

  return result;
};
const updateBlog = async (id: string, payload: Partial<TBlog>) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, 'Blog id Invalid');
  }
  const result = await Blog.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const BlogServices = {
  createBlog,
  getAllBlog,
  deleteSingleBlog,
  getSingleBlog,
  updateBlog,
  getBlogByUser
};
