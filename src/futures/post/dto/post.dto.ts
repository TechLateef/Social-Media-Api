import { IsOptional, IsString, IsUrl } from 'class-validator';
import { IUser } from '../../auth/entities/auth.entity';
import { Post } from '../entities/post.entity'


export class CreatePostDto {
    @IsString()
    @IsOptional()
    text?: string

    @IsUrl()
    postUrl?: string
}

export class createCommentDto {
    @IsString()
    content?: string;

    author?: IUser
}