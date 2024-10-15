import express from "express";
import { loginUser, signupUser, logoutUser, verifyCookie, refreshToken } from "../controllers/userController.js";

//Router
const userRouter = express.Router();

//Path
userRouter.post("/login", loginUser)
userRouter.post("/signup", signupUser);
userRouter.post("/verifyCookie", verifyCookie)
userRouter.post("/refreshToken", refreshToken)
userRouter.post("/logout", logoutUser)


export default userRouter;