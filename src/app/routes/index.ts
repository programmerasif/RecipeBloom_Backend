import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';

import { UserRoutes } from '../modules/User/user.route';
import { RecipeRoutes } from '../modules/Recipe/recipe.route';
import { CommentRoutes } from '../modules/comment/comment.route';
import { BlogRouter } from '../modules/Blog/blog.route';
import { CategoryRoutes } from '../modules/category/category.route';

type TModuleRoutes = {
  path: string;
  route: Router;
};

const router = Router();

const moduleRoutes: TModuleRoutes[] = [
  {
    path: '/users',
    route: UserRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/recipe',
    route: RecipeRoutes,
  },
  {
    path: '/comment',
    route: CommentRoutes,
  },
  {
    path: '/blog',
    route: BlogRouter,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
