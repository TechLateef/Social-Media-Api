import { Schema, Document, Types, model } from "mongoose";

export interface IPost extends Document {
    author: Types.ObjectId;  // Reference to User
    content: string;         // The actual post content
    postUrl: string;
    likes: Types.ObjectId[]; // Array of users who liked the post
    comments: Types.ObjectId[];  // Array of comments (referencing Comment model)
}

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    postUrl: {
        type: String,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',  // Referencing users who liked the post
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',  // Referencing comments on the post
    }]
}, { timestamps: true });


PostSchema.pre('save', async function () {
    try {
        //Find the user document and update its posts array with the new post
        const user = await model('User').findByIdAndUpdate(this.author, { $push: { post: this._id } }, { new: true })

    } catch (error) {
        console.error(error)
    }
})

export const Post = model<IPost>('Post', PostSchema);
