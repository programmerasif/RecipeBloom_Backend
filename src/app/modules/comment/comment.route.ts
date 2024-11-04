import { Router } from 'express';
import { CommentControllers } from './comment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidation } from './comment.validation';

const route = Router();

route.post(
  '/',
  validateRequest(CommentValidation.createCommentValidation),
  CommentControllers.createComment,
);
route.patch(
  '/updateComment',
  CommentControllers.updateComment,
);
route.delete(
  '/deleteComment',
  CommentControllers.deleteComment,
);
route.post(
  '/like',
  CommentControllers.createLike,
);
route.post(
  '/dislike',
  CommentControllers.createDislike,
);


route.get('/:id', CommentControllers.getCommentForRecipe);

export const CommentRoutes = route;
