import {Router} from "express"
import { AuthController } from "../controller/auth/auth.controller"
import { verifyToken, isAdmin } from "../middleware/auth.middleware"

const AuthRouter = Router()

// Login route
AuthRouter.post("/login", AuthController.login)

// Register route (admin only)
AuthRouter.post("/register", verifyToken, isAdmin, AuthController.register)


// Get current user route
AuthRouter.get("/me", verifyToken, AuthController.getCurrentUser)

export default AuthRouter

