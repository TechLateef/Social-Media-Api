import { createCommentDto, CreatePostDto } from "../dto/post.dto";
import { Auth, IUser } from "../../auth/entities/auth.entity";
import { IPost, Post } from "../entities/post.entity";
import commentEntity, { IComment } from "../entities/comment.entity";
import { Model } from "mongoose";


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



    
    /**
 * @description Like or unlike an entity (post or comment) depending on the user's current reaction
 * @param entityType - The model (e.g., Post or Comment model)
 * @param entityId - The ID of the entity to like or unlike
 * @param user - The authenticated user performing the action
 * @returns boolean - true if liked, false if unliked
 */
    public async likeOrUnlike<T extends { likes: string[]; updateOne: Function }>(
        entityType: Model<T>,
        entityId: string,
        user: IUser
    ): Promise<boolean> {
        try {
            // Find the entity (could be a post or a comment)
            const entity = await entityType.findById(entityId);

            if (!entity) {
                throw new Error(`${entityType.modelName} with ID ${entityId} not found`);
            }

            const userId = user.id;

            // Check if user has already liked the entity
            if (!entity.likes.includes(userId)) {
                // Add user to the likes array
                await entity.updateOne({ $push: { likes: userId } });
                return true; // Entity was liked
            }

            // Remove user from the likes array
            await entity.updateOne({ $pull: { likes: userId } });
            return false; // Entity was unliked

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
    public async fetchAllPosts(user: IUser) {
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
            throw error;
        }
    }

    /**
     * @description add comment to post
     * @param commentData Object- e.g {content: string, author: Auth}
     * @param postId - string 
     * @returns 
     */
    public async commentOnPost(commentData: createCommentDto, postId: string): Promise<IComment> {
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error(`Post with ID ${postId} not found`);
        }

        // Create a new comment and associate it with the post
        const newComment = await commentEntity.create({ post: post._id, ...commentData });
        await newComment.save();

        return newComment;
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
            const comment = await commentEntity.findById(commentId);
            if (!comment) {
                throw new Error(`Comment with ID ${commentId} not found`);
            }

            // Create a new reply
            const newReply = await commentEntity.create({ ...replyData });
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