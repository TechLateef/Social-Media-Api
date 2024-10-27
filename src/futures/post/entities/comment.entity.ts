import { Types, Schema, model } from "mongoose";

export interface IComment extends Document {
    post: Types.ObjectId;       // The post this comment is attached to
    author: Types.ObjectId;     // The user who made the comment
    content: string;            // The comment content
    likes: Types.ObjectId[];    // Users who liked the comment
    replies: Types.ObjectId[];  // Array of replies (comments referencing comments)
}

const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',  // Reference to the post this comment belongs to
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user who made the comment
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',  // Users who liked the comment
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',  // Self-referencing: replies to comments
    }]
}, { timestamps: true });

export default model<IComment>('Comment', CommentSchema);
