import { Document, Types, Schema, model, Model } from "mongoose";

// Extend Document to inherit Mongoose-specific properties
export interface IComment extends Document {
    post: Types.ObjectId;       // The post this comment is attached to
    author: Types.ObjectId;     // The user who made the comment
    content: string;            // The comment content
    likes: Types.ObjectId[];    // Users who liked the comment
    replies: Types.ObjectId[];  // Array of replies (comments referencing comments)
}

// Define the schema
const CommentSchema = new Schema<IComment>({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
}, { timestamps: true });

// Define and export the model with typing
export const Comment: Model<IComment> = model<IComment>('Comment', CommentSchema);
