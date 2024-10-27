


export interface CreateUserDto {
    username: string

    email: string

    password: string

}


export interface EditProfileDto {
    bio: string;
    profileUrl: string;
    phone?: string
}