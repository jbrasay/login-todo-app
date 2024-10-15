import express from "express";
import { loginUser, signupUser, logoutUser, verifyCookie, refreshToken } from "../controllers/userController.js";

const userRouter = express.Router();

//Endpoints
userRouter.post("/login", loginUser)
userRouter.post("/signup", signupUser);
userRouter.post("/verifyCookie", verifyCookie)
userRouter.post("/refreshToken", refreshToken)
userRouter.post("/logout", logoutUser)


export default userRouter;