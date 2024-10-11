// import { USER_ROLE } from "./../modules/User/user.utils";
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import AppError from "../errors/AppError";
// import { User } from "../modules/User/user.model";
// import catchAsync from "../utils/catchAsync";

// const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
//     const token = req.cookies.accessToken;
//      console.log(token);
//     // checking if the token is missing
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! who is she?");
//     }

//     // checking if the given token is valid
//     const decoded = jwt.verify(
//       token,
//       config.jwt_access_secret as string,
//     ) as JwtPayload;

//     const { role, email } = decoded;

//     // checking if the user is exist
//     const user = await User.findOne({ email });

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
//     }
//     if (user?.isBlocked) {
//       throw new AppError(httpStatus.NOT_FOUND, "Unauthorize User!");
//     }

//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         "You are not authorized  hi!",
//       );
//     }

//     req.user = decoded as JwtPayload & { role: string };
//     next();
//   });
// };

// export default auth;
import { USER_ROLE } from "./../modules/User/user.utils";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { User } from "../modules/User/user.model";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null; // Get the token from the Authorization header

  

    // Check if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! Token is missing.");
    }

    // Check if the given token is valid
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token.");
    }

    const { role, email } = decoded;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }
    if (user.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked.");
    }

    // Check if the user has the required roles
    if (requiredRoles.length > 0 && !requiredRoles.includes(role as keyof typeof USER_ROLE)) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource.");
    }

    // Attach the user data to the request object
    req.user = { ...decoded, role };
    next();
  });
};

export default auth;

