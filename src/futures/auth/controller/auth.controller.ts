import { RequestHandler } from "express";
import { AuthService } from "../service/auth.service";
import { IUser } from "../entities/auth.entity";
import { RequireFieldHandler } from "../../../core/utils/requireFieldHandler";
import { StatusCodes } from "http-status-codes";
import { plainToClass, plainToInstance } from "class-transformer";
import { EditProfileDto } from "../dto/auth.dto";
import { validate } from "class-validator";



export class AuthController {
    constructor(private readonly authService: AuthService) { }




    /**
     * @description register new user
     * @access public
     * @router POST /signup
     * @param req Express Request
     * @param res Express Response
     * @param next Express NextFunction
     */
    public signUp: RequestHandler = async (req, res, next): Promise<void> => {

        try {
            const { username, email, password } = req.body

            const requireFields = ['username', 'email', 'password']

            RequireFieldHandler.Requiredfield(req, res, requireFields)

            const newUser = await this.authService.createUser({ username, email, password })

            if (!newUser) {
                throw new Error('Error: User not Registered')
            }

            res.status(StatusCodes.OK).json({ message: "success", newUser })

        } catch (error) {
            console.error(error)
            throw new Error(`Error Registering user ${error}`)


        }




    }




    /**
        * @description Login  user
        * @access public
        * @router POST /login
        * @param req Express Request
        * @param res Express Response
        * @param next Express NextFunction
        */
    public login: RequestHandler = async (req, res, next): Promise<void> => {

        try {
            const { email, password } = req.body

            if (!email || !password) {
                throw new Error('Invalid email or password')
            }

            const user = await this.authService.login(email, password)
            if (!user) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(user)
            }
        } catch (error) {
            next(error)
        }


    }

    public editProfile: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const editProfileData = plainToClass(EditProfileDto, req.body)

            const errors = await validate(editProfileData)

            if (errors.length > 0) {
                res.status(400).json({ errors: errors.map(error => error.toString()) });

            }

            const editedProfile = await this.authService.editProfile(editProfileData, req.user?.id)

            res.status(StatusCodes.OK).json({ message: 'success', editedProfile })
        } catch (error) {

            next(error)
        }

    }


    /**
     * @description get User profile with username
     * @access private
     * @route GET /get-user
     * @param req Express Request
     * @param res Express Response
     * @param next 
     */
    public getUserByUsername: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const username = req.body.username

            const isUser = await this.authService.getUserByUsername(username)

            res.status(StatusCodes.OK).json({ message: "Success", isUser })
        } catch (error) {

            next(error)

        }

    }

    /**
     * @description follow or unfollow user depending on if they are already following each other or not
     * @access private
     * @route PATCH /follow-or-unfollow
     * @param req 
     * @param res 
     * @param next 
     */
    public followOrUnfollow: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const targetUserId = req.params.targetUserId

            const currentUser = req.user!

            const followOrUnFollow = await this.authService.followOrUnfollow(targetUserId, currentUser)

            res.status(StatusCodes.OK).json({ message: 'Success', followOrUnFollow })
        } catch (error) {
            console.error(error)
            throw new Error("Internal server Error, Our team are working on it")
        }
    }



}
