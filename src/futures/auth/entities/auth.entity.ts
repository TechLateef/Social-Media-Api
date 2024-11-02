import { Schema, Document, Types, Mongoose, model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IUser extends Document {
    password: string;
    email: string;
    username: string;
    profileUrl: string;
    verified: boolean;
    MFA: boolean;
    bio: string;
    posts: Types.ObjectId[];  // Should reference the Post schema
    followers: Types.ObjectId[];  // Array of user IDs who follow this user
    following: Types.ObjectId[];  // Array of user IDs this user is following
    getResetPasswordToken(): string;
    getSignedToken(): string;
    changesPasswordAfter(tokenTimeStamp: number): string;
    resetPasswordToken: string | undefined;
    resetPasswordExpire: number | undefined;
    matchPassword(password: string): Promise<boolean>;
}

const AuthSchema = new Schema({
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password cannot be less than 8 characters'],
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Username is required"],
        index: true,
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Enter your email address"],
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            "Enter a valid email address",
        ],
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
        maxLength: [160, 'Bio cannot be more than 160 characters'],  // Optional validation
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',  // Reference the Post schema
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',  // Referencing the User schema itself
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',  // Referencing the User schema itself
    }],
    MFA: {
        type: Boolean,
        default: false,
    },
    profileUrl: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Number,
    passwordChangedAt: {
        type: Date,
        select: false,
        default: Date.now(),
    },
}, { timestamps: true });

// Password hashing middleware
AuthSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password matching method
AuthSchema.methods.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT
AuthSchema.methods.getSignedToken = function () {
    return jwt.sign({ userId: this._id, name: this.name, iat: Date.now() + 1000 }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE || '1h',
    });
};

AuthSchema.methods.changesPasswordAfter = function (tokenTimeStamp: number) {
    if (this.passwordChangedAt) {
        const lastPassChangedAt = this.passwordChangedAt.getTime() / 1000
        return tokenTimeStamp < lastPassChangedAt
    }
    return false
}
// Generate Reset Password Token
AuthSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 10 minutes
    return resetToken;
};

export const Auth = model<IUser>('User', AuthSchema);


