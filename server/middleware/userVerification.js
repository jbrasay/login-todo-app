import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

//Verify if user token is valid
const userVerification = (req, res, next) => {
    const token = req.cookies.token;
    //console.log(req.query.isTodo);
    const {isTodo} = req.body;
    if (req.query.isTodo) {
        console.log("Params: " + req.query.isTodo);
    }
    //console.log(isTodo);
    console.log(token);
    if (!token) {
        return res.json({status: false, message:"No Token Found!"});
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        //console.log(data);
        //Return false if token expired
        if (err) {
            return res.json({message: err.message, status: false});
        }
        else {
            const user = await UserModel.findById(data.id);
            if (isTodo || req.query.isTodo) {
                req.user = user;
                console.log(user._id);
                req.token = token;
                next();
            }
            //console.log(data.id);
            else if (!isTodo && user) {
                //console.log("First Time Login!");
                return res.status(201).json({status: true, message: "Token verified!", username: user.username})
            }
            else {
                return res.status(400).json({status: false, message: "Failed!"})
            }
        }
    })
}

export default userVerification;