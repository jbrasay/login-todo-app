import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

const userAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    //console.log("Header: ", authorization.split(" ")[1]);
    if (!authorization) {
        return res.status(401).json({status: false, message:"No Access Token Found!"});
    }
    const accessToken = authorization.split(" ")[1];
    console.log("Access Token: ", accessToken);
    jwt.verify(accessToken, process.env.AUTH_ACCESS_TOKEN_SECRET, async (error, decoded) => {
        if (error) {
            //Handle invlaid or expired access token
            console.log("Expired!");
            res.status(403).json({message: "Invalid or expired access token", success: false})
        } 
        else {
            //If Access token is still valid, store decoded token in req.user, then go to the next function
            //req.user = user;
            //console.log(user._id);
            console.log("Not Expired");
            req.user = decoded;
            next();
        }
    })
}

export default userAuth;