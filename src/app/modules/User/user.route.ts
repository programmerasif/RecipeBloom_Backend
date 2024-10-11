import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { updateUserValidationSchema } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.utils";

const router = express.Router();

router.get("/", UserController.getAllUsers);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.findUserById,
);
router.patch("/status/:id", auth(USER_ROLE.admin), UserController.toggleStatus);
router.patch(
  "/promote-admin/:id",
  auth(USER_ROLE.admin),
  UserController.promoteToAdmin,
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(updateUserValidationSchema),
  UserController.updateUserById,
);

router.post("/follow", auth(USER_ROLE.user,USER_ROLE.admin), UserController.followUser);
router.post("/unfollow", auth(USER_ROLE.user,USER_ROLE.admin), UserController.unFollowUser);

router.delete("/:id", auth(USER_ROLE.admin), UserController.deleteUserById);

export const UserRoutes = router;
