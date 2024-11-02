import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Auth } from "../../futures/auth/entities/auth.entity";
import jsonResponse from "../utils/lib";
import catchAsync from "../utils/catchAsync";
import  jsonwebtoken from 'jsonwebtoken'

const authenticationMiddleware = catchAsync(async (req, res, next) => {
    // If user is already authenticated
    if (req.user?._id) return next();
  
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return jsonResponse(
        StatusCodes.UNAUTHORIZED,
        "",
        res,
        "You are not logged in, please log in to get access"
      );
    }
  
    try {
        const jwtSecret = process.env.jwtSecret!
      const decoded = jsonwebtoken.verify(token,jwtSecret ) as jwt.JwtPayload;
      const { userId, iat } = decoded;
  
      //verify if user still exists
      const user = await Auth.findById(userId);
      if (!user) {
        return next(new Error("The user with this token no longer exists"));
      }
  
      // confirm if user doesnt change password after the token is issued
      if (user.changesPasswordAfter(iat!)) {
        throw new Error("User recently changed password!! please log in again");
      }
  
      req.user = user;
      next();
    } catch (error) {
      throw new Error(`Not Authorized ${error}`);
    }
  });
export { authenticationMiddleware };
