import express from "express";
import { loginUser, signupUser, logoutUser, verifyCookie, refreshToken } from "../controllers/userController.js";
import userVerification from "../middleware/userVerification.js"

const userRouter = express.Router();

//Authenticate user
//userRouter.get("/getUser", getUser);
userRouter.post("/login", loginUser)
userRouter.post("/signup", signupUser);
userRouter.post("/verify", userVerification);
userRouter.post("/verifyCookie", verifyCookie)
userRouter.post("/refreshToken", refreshToken)
userRouter.post("/logout", logoutUser)


export default userRouter;