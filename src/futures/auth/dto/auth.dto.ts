import { IsOptional, IsString, IsUrl } from "class-validator";



export class EditProfileDto {
    @IsUrl()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    profileUrl?: string;

    @IsString()
    @IsOptional()
    phone?: string
}



export interface CreateUserDto {
    username: string

    email: string

    password: string

}