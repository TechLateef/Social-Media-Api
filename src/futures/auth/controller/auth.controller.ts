import { RequestHandler } from "express";
import { AuthService } from "../service/auth.service";
import { IUser } from "../entities/auth.entity";
import { RequireFieldHandler } from "../../../core/utils/requireFieldHandler";
import { StatusCodes } from "http-status-codes";



export class AuthController {
    constructor(private readonly authService: AuthService) { }




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
     * async
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

}
