import { RequestHandler } from "express";
import { PostService } from "../services/post.service";
import { plainToClass } from "class-transformer";
import { createCommentDto, CreatePostDto } from "../dto/post.dto";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { IPost, Post } from "../entities/post.entity";
import { IUser } from "../../auth/entities/auth.entity";
import jsonResponse from "../../../core/utils/lib";



export class PostController {
    constructor(private readonly postService: PostService) { }


    public post: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const postData = plainToClass(CreatePostDto, req.body)

            const errors = await validate(postData)

            if (errors.length > 0) {
                res.status(400).json({ errors: errors.map(error => error.toString()) });

            }
            const newPost = await this.postService.createPost(postData, req.user!)

            res.status(StatusCodes.OK).json({ message: 'Success', newPost })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Its not you, its us our team are looking in to it ' })
        }
    }


    public postComment: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const postId = req.params.postId
            const commentDataDto = plainToClass(createCommentDto, req.body)
            const errors = await validate(commentDataDto)
            if (errors.length > 0) {
                res.status(400).json({ errors: errors.map(error => error.toString()) });

            }

            const newComment = await this.postService.commentOnPost(commentDataDto, postId)

            res.status(StatusCodes.OK).json({ message: 'success' })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Its not you, its us our team are looking in to it ' })

        }
    }


    public likeorUnlikePost: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const postId = req.params.postId

            const user = req.user as IUser
            const liked = await this.postService.likeOrUnlike(Post, postId, user)

            jsonResponse(StatusCodes.OK, '', res, liked ? "Post liked" : "Post unliked")
        } catch (error) {
            next(error)
        }

    }


    public fetchPost: RequestHandler = async (req, res, next): Promise<void> => {
 try {
    const user = req.user as IUser

    const allPost = await this.postService.fetchAllPosts(user,res)
    if (!allPost) {
        return allPost
    }

    jsonResponse(StatusCodes.OK, '', res, 'success')

 } catch (error) {
  next(error)  
 }

    }
}