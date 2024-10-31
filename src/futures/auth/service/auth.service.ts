import { CreateUserDto, EditProfileDto } from "../dto/auth.dto";

import { Auth, IUser } from '../entities/auth.entity'

export class AuthService {
    constructor() { }


    /**
     *@description create new user 
     * @param userData object- username, email and passord
     * @returns 
     */
    public async createUser(userData: CreateUserDto): Promise<IUser> {

        const newUser = await Auth.create({ ...userData })

        await newUser.save()
        return newUser

    }


    /**
     * @description login user using email and password
     * @param email user email address 
     * @param password user 8 digit password
     * @returns Json Web Token
     */
    public async login(email: string, password: string): Promise<string | void> {
        try {
            const isUser = await Auth.findOne({ email })
        if (!isUser) {
            throw new Error('Invalid email or password')
        }

        const isPassword = await isUser.matchPassword(password)
        if (!isPassword) {
            throw new Error('Invalid email or password')

        }

        return isUser.getSignedToken()
        } catch (error) {
            console.error(error)
            
        }
    }

    /**
     * @description Create/Edit user profile
     * @param userData user data to be updated
     * @param userId user uniquier Id
     * @returns boolean
     */
    public async editProfile(userData: EditProfileDto, userId: string): Promise<boolean> {
        const updatedUser = await Auth.findByIdAndUpdate(userId, { ...userData })

        if (!updatedUser) {
            throw new Error('Error updating Profile if this continue please contact our support')
        }
        return true
    }


    /**
     * @description Fetch user using the provided username 
     * @param username userName: string 
     * @returns user Data
     */
    public async getUserByUsername(username: string): Promise<IUser> {
        const isUser = await Auth.findOne({ username })
        if (!isUser) {
            throw new Error(`Can not find User with the username: ${username} `)
        }
        return isUser
    }

    /**
     * @description follow or unfollow user
     * @param userId string
     * @param currentUser Auth
     * @returns 
     */
    public async followOrUnfollow(userId: string, currentUser: IUser): Promise<boolean> {
        try {
            // Prevent users from following themselves
            if (userId === currentUser.id) {
                throw new Error("Users cannot follow or unfollow themselves.");
            }

            // Check if the user to be followed/unfollowed exists
            const targetUser = await Auth.findById(userId);
            if (!targetUser) {
                throw new Error(`User with ID ${userId} not found.`);
            }

            // Check if the current user exists
            const authUser = await Auth.findById(currentUser.id);
            if (!authUser) {
                throw new Error(`Current user with ID ${currentUser.id} not found.`);
            }

            // Determine follow/unfollow action based on existing relationship
            const isFollowing = targetUser.followers.includes(currentUser.id);

            if (!isFollowing) {
                // Add follower to target user and add following to current user
                await Promise.all([
                    targetUser.updateOne({ $push: { followers: currentUser.id } }),
                    authUser.updateOne({ $push: { following: userId } })
                ]);
                return true; // Successfully followed
            } else {
                // Remove follower from target user and remove following from current user
                await Promise.all([
                    targetUser.updateOne({ $pull: { followers: currentUser.id } }),
                    authUser.updateOne({ $pull: { following: userId } })
                ]);
                return false; // Successfully unfollowed
            }

        } catch (error) {
            console.error("Error in followOrUnfollow:", error);
            throw error;
        }
    }

}