import express, { Router } from "express";
import { PostService } from "../services/post.service";
import { PostController } from "../controller/post.controller";
import { authenticationMiddleware } from "../../../core/middleware/middleware";

export const postRoute = Router();

const postService = new PostService();
const postController = new PostController(postService);

// Apply authentication middleware to all routes in postRoute
postRoute.use(authenticationMiddleware);

// Post routes
postRoute.post('/post', (req, res, next) => postController.post(req, res, next));
postRoute.get('/post', (req, res, next) => postController.fetchPost(req, res, next));
postRoute.patch('/post/:postId', (req, res, next) => postController.toggleLikePost(req, res, next));

// Comment routes
postRoute.post('/comment', (req, res, next) => postController.commentOnPost(req, res, next));
postRoute.post('/comment/reply/:commentId', (req, res, next) => postController.replyComment(req, res, next));
postRoute.patch('/comment/:commentId', (req, res, next) => postController.toggleLikeComment(req, res, next));

export default postRoute;
