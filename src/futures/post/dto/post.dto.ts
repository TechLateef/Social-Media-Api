import { IUser } from '../../auth/entities/auth.entity';
import { Post } from '../entities/post.entity'


export interface CreatePostDto {
    text?: string
    postUrl: string
}

export interface createCommentDto {
    content: string;
    author: IUser
}