import { Router } from "express";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controller/auth.controller";


const authRouter = Router()


const authService = new AuthService()

const authCcontroller = new AuthController(authService)


// Route for user rehisteration
authRouter.post('/signup', (req, res, next) => authCcontroller.signUp(req, res, next))


//Route to login user
authRouter.post('/login', (req, res, next) => authCcontroller.login(req, res, next))

//Route for getting user profile
authRouter.get('/get-user', (req, res, next) => authCcontroller.getUserByUsername(req, res, next))


//Route to edit user Profile
authRouter.patch('/edit-profile', (req, res, next) => authCcontroller.editProfile(req, res, next))

//Route for follow or unfollow user
authRouter.patch('/follow-or-unfollow', (req, res, next) => authCcontroller.followOrUnfollow(req, res, next))



