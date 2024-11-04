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
  "/promote-premium/:id",
  UserController.promoteToPremium,
);

router.patch(
  "/:id",
  validateRequest(updateUserValidationSchema),
  UserController.updateUserById,
);

router.post("/follow", UserController.followUser);
router.post("/unfollow", UserController.unFollowUser);

router.delete("/:id", auth(USER_ROLE.admin), UserController.deleteUserById);
router.get("/followers/:id", UserController.getFollowersById);
router.get("/following/:id", UserController.getFollowingsById);
router.post("/updatePass", UserController.updatePasswordByEmail);
 
export const UserRoutes = router;
