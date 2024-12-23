import { createCommentDto, CreatePostDto } from "../dto/post.dto";
import { Auth, IUser } from "../../auth/entities/auth.entity";
import { IPost, Post } from "../entities/post.entity";
import { IComment, Comment } from "../entities/comment.entity";
import { Model, Document, Types } from "mongoose";
import jsonResponse from "../../../core/utils/lib";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";

interface ILikable extends Document {
    likes: (Types.ObjectId | string)[];
}

export class PostService {

    constructor() { }


    /**
     * @description create new Post 
     * @param postData object {content: string postUrl: image or vidoe}
     * @param user Auth user
     * @returns 
     */
    public async createPost(postData: CreatePostDto, user: IUser): Promise<CreatePostDto> {

        const newPost = await Post.create({ author: user, ...postData })

        if (!newPost) {
            throw new Error('Error creating post')
        }

        return newPost
    }


    public async getPostById(postId: string, res: Response) {
        const post = await Post.findById(postId)
        if (!post) {
            jsonResponse(StatusCodes.BAD_REQUEST, '', res, `Post with the Id${postId} not found`)
        }
        return post
    }


    /**
 * @description Like or unlike an entity (post or comment) depending on the user's current reaction
 * @param entityType - The model (e.g., Post or Comment model)
 * @param entityId - The ID of the entity to like or unlike
 * @param user - The authenticated user performing the action
 * @returns boolean - true if liked, false if unliked
 */
    public async likeOrUnlike<T extends Document>(
        entityType: Model<T>,
        entityId: string,
        user: IUser
    ): Promise<boolean> {
        try {
            const entity = await entityType.findById(entityId);

            if (!entity) {
                throw new Error(`${entityType.modelName} with ID ${entityId} not found`);
            }

            if (!("likes" in entity)) {
                throw new Error("This entity does not support likes functionality.");
            }

            const userId = new Types.ObjectId(user.id);

            if (!(entity.likes as Types.ObjectId[]).includes(userId)) {
                await entity.updateOne({ $push: { likes: userId } });
                return true;
            }

            await entity.updateOne({ $pull: { likes: userId } });
            return false;

        } catch (error) {
            console.error(`Error liking or unliking ${entityType.modelName}:`, error);
            throw error;
        }
    }


    /**
     * @description fetch user post and  following users
     * @param user Auth user
     * @returns 
     */
    public async fetchAllPosts(user: IUser, res: Response) {
        try {
            const currentUser = await Auth.findById(user.id);

            if (!currentUser) {
                throw new Error("Unauthorized");
            }

            // Fetch all posts by user and their friends in a single query, sorted by creation date
            const allPosts = await Post.find({ userId: { $in: [user.id, ...currentUser.following] } }).sort({ createdAt: -1 });

            return allPosts;
        } catch (error) {
            console.error("Error fetching posts:", error);
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res)
        }
    }

    /**
     * @description add comment to post
     * @param commentData Object- e.g {content: string, author: Auth}
     * @param postId - string 
     * @returns 
     */
    public async commentOnPost(commentData: createCommentDto, postId: string, res: Response): Promise<IComment | void> {
        try {
            // Check if the post exists
            const post = await Post.findById(postId);
            if (!post) {
                throw new Error(`Post with ID ${postId} not found`);
            }

            // Create a new comment and associate it with the post
            const newComment = await Comment.create({ post: post._id, ...commentData });
            await newComment.save();

            return newComment;
        } catch (error) {
            jsonResponse(StatusCodes.INTERNAL_SERVER_ERROR, '', res)
        }
    }

    /**
     * @description create reply to a comment
     * @param replyData object e.g {content: string, author: Auth}
     * @param commentId string comment Id 
     * @returns 
     */
    public async replyComment(replyData: createCommentDto, commentId: string): Promise<IComment> {
        try {
            // Check if the comment exists
            const comment = await Comment.findById(commentId);
            if (!comment) {
                throw new Error(`Comment with ID ${commentId} not found`);
            }

            // Create a new reply
            const newReply = await Comment.create({ ...replyData });
            await newReply.save();

            // Add the new reply to the existing comment's replies array
            await comment.updateOne({ $push: { replies: newReply._id } });

            return newReply;
        } catch (error) {
            console.error("Error replying to comment:", error);
            throw error;
        }
    }


}