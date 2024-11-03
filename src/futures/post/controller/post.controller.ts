import { RequestHandler } from "express";
import { PostService } from "../services/post.service";
import { plainToClass } from "class-transformer";
import { createCommentDto, CreatePostDto } from "../dto/post.dto";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { IPost, Post } from "../entities/post.entity";
import { IUser } from "../../auth/entities/auth.entity";
import jsonResponse from "../../../core/utils/lib";
import { IComment, Comment } from "../entities/comment.entity";
import { NotificationService } from "../../notification/service/notication.service";



export class PostController {
    constructor(private readonly postService: PostService,    private readonly notificationService: NotificationService 
    ) { }


    /**
     * @description  make new post
     * @access private
     * @route POST /post
     * @param req 
     * @param res 
     * @param next 
     */
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


    /**
     * @description make a comment on a post
     * @access private
     * @route POST /comment
     * @param req 
     * @param res 
     * @param next 
     */
    public postComment: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const postId = req.params.postId
            const commentDataDto = plainToClass(createCommentDto, req.body)
            const errors = await validate(commentDataDto)
            if (errors.length > 0) {
                res.status(400).json({ errors: errors.map(error => error.toString()) });

            }

            const newComment = await this.postService.commentOnPost(commentDataDto, postId, res)

            res.status(StatusCodes.OK).json({ message: 'success' })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Its not you, its us our team are looking in to it ' })

        }
    }


    /**
     * @description toggle like for a post
     * @access private
     * @route PATCH /post/:postId 
     * @param req 
     * @param res 
     * @param next 
     */
    public toggleLikePost: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const postId = req.params.postId

            const user = req.user as IUser
            const liked = await this.postService.likeOrUnlike(Post, postId, user)

            jsonResponse(StatusCodes.OK, '', res, liked ? "Post liked" : "Post unliked")
        } catch (error) {
            next(error)
        }

    }


    /**
     * @description get all post
     * @access private
     * @route GET /post
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public fetchPost: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const user = req.user as IUser

            const allPost = await this.postService.fetchAllPosts(user, res)
            if (!allPost) {
                return allPost
            }

            jsonResponse(StatusCodes.OK, '', res, 'success')

        } catch (error) {
            next(error)
        }

    }


    /**
     * @description comment on a post
     * @access private
     * @route POST /comment
     * @param req 
     * @param res 
     * @param next 
     */

    public commentOnPost: RequestHandler = async (req, res, next): Promise<void> => {

        try {
            const user = req.user as IUser;
            const postId = req.params.postId

            const commentData = plainToClass(createCommentDto, req.body)

            commentData.author = user
            await validate(commentData)

            const newComment = await this.postService.commentOnPost(commentData, postId, res)

            jsonResponse(StatusCodes.OK, newComment, res)

        } catch (error) {
            next(error)
        }


    }

    /**
     * @description reply to comment using the comment id
     * @access private
     * @route POST /comment/reply
     * @param req 
     * @param res 
     * @param next 
     */
    public replyComment: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const user = req.user as IUser

            const commentId = req.params.commentId

            const replyData = plainToClass(createCommentDto, req.body)

            replyData.author = user

            await validate(replyData)
            const newReply = await this.postService.replyComment(replyData, commentId)

            jsonResponse(StatusCodes.OK, newReply, res)
        } catch (error) {
            next(error)
        }

    }

/**
 * @description Toggle like a comment
 * @access private
 * @route PATCH /comment/:commentId
 * @param req 
 * @param res 
 * @param next 
 */
    public toggleLikeComment: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const postId = req.params.postId

            const user = req.user as IUser
            const liked = await this.postService.likeOrUnlike(Comment, postId, user)

            jsonResponse(StatusCodes.OK, '', res, liked ? "Comment liked" : "Comment unliked")
        } catch (error) {
            next(error)
        }

    }

}