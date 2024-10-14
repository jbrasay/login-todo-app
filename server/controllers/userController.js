
import UserModel from "../models/UserModel.js"; 
import bcrypt from "bcrypt" 
import validator from "validator"
import jwt from "jsonwebtoken"
import {createAccessToken, createRefreshToken} from "../util/secretToken.js";
import dotenv from "dotenv"
dotenv.config();


const loginUser = async (req, res, next) => {
    //console.log("Request Body: ", req.body);
    //const {Authorization} = req.headers;
    //console.log("Header: ", Authorization);
    //console.log(req.cookies);
    /*
    if (req.cookies.token) {
        console.log("I have token!");
    }
    */
    try {
        //Unpack email and password from the request body
        const {email, password} = req.body;

        //Check if email and password field is not empty
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).json({message: "Please fill all fields", success: false});
        }

        //Check if user exist
        const user = await UserModel.findOne({email});
        console.log(user._id);
        if (!user) {
            return res.status(404).json({message: "User does not exist!", success: false});
        }

        //Check if user entered the correct password
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({message: "Incorrect password!", success: false})
        }
        
        //Create token and send to client as cookies
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        //console.log("Refresh: ",refreshToken)
        res.cookie("refreshToken", refreshToken, {
            //withCredentials: true,
            httpOnly: true,
            expires: new Date(Date.now() + 86400000), //Expires in 24 hours
        });
        //Send success message
        res.status(201).json({message: "User logged in successfully", success: true, user: user, accessToken: accessToken});
        //console.log("Email: " + email);
        //console.log("Password: " + password)
        next();
    } catch(error) {
        res.status(500).json({message: error.message});
    }

}

const signupUser = async (req, res, next) => {
    //console.log(req);
    console.log("Req Body: ",req.body);
    
    try {
        const {email, username, password, createdAt} = req.body;
        
        //console.log(req.cookies.token);
        //console.log("Email" + email);
        
        //Check if username, email, and password is empty
        if (validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).json({message: "Please fill all fields", success: false});
        }
        //Check if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({message: "Please enter a valid email", success: false});
        }
        //Check if password meets the requirements
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: "Password does not meet requirements: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1", success: false})
        }
        
        //Check if user already exist
        const userExist = await UserModel.findOne({email});
        if (userExist) {
            return res.status(400).json({message: "User already exist!"});
        }
        
        //Hash the password provided by the user
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        //console.log("Hash Password: " + hashPassword);
        
        //Create the user in mongodb database
        const user = await UserModel.create({username, email, password: hashPassword, createdAt});

        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        //console.log("Token: " + token);        
        //Send the token as a cookie to the user
        
        res.cookie("refreshToken", refreshToken, {
            //withCredentials: true,
            httpOnly: true,
            expires: new Date(Date.now() + 86400000), //Expires in 24 hours
        });
        
        res.status(201).json({message: "Account created successfully", success: true, user: user, accessToken: accessToken});
        next();
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * 
 * @param {*} req The request received from the client
 * @param {*} res The response sent to the client
 * 
 * Store the cookie refresh token
 * Check if its not null, else return a 401 status no refresh token message
 * If refresh exist, verify if token has not expired or invalidated, return a 401 status 
 * If reresh token is valid, create a new access token and retrieve the user using the id from the refresh token.
 * Send 201 status response to the client containing the new refresh token and user data
 */
const verifyCookie = async (req, res) => {
    const refreshCookie = req.cookies.refreshToken;
    console.log("Refresh: ", refreshCookie)
    if (refreshCookie) {
        jwt.verify(refreshCookie, process.env.AUTH_REFRESH_TOKEN_SECRET, async (error, decoded) => {
            if (error) {
                //Handle invlaid or expired refresh token
                res.status(401).json({message: "Invalid or expired refresh token", success: false})
            } 
            else {
                //Generate a new access Token
                console.log("Decoded: ", decoded);
                //const user = await UserModel.findById(decoded.id);

                const accessToken = createAccessToken(decoded.id);
                const user = await UserModel.findById(decoded.id);
                //console.log("Verify Cookie USer: ", user);
                res.status(201).json({message: "New Access Token Created!", success: true, accessToken, user});
            }
        });
        //console.log("I have refresh Cookie!")
        //res.status(201).json({message: "I have Cookie", success: true});
    }
    else {
        res.status(401).json({message: "No refresh Token!", success: false});
    }
}

const refreshToken = async (req, res) => {
    const refreshCookie = req.cookies.refreshToken;
    console.log("Refresh Access: ", refreshCookie)
    if (refreshCookie) {
        jwt.verify(refreshCookie, process.env.AUTH_REFRESH_TOKEN_SECRET, async (error, decoded) => {
            if (error) {
                //Handle invlaid or expired refresh token
                res.status(401).json({message: "Invalid or expired refresh token", success: false})
            } 
            else {
                //Generate a new access Token
                //console.log("Decoded: ", decoded);
                //const user = await UserModel.findById(decoded.id);

                const accessToken = createAccessToken(decoded.id);
                //const user = await UserModel.findById(decoded.id);
                //console.log("Verify Cookie USer: ", user);
                res.status(201).json({message: "New Access Token Created!", success: true, accessToken});
            }
        });
        //console.log("I have refresh Cookie!")
        //res.status(201).json({message: "I have Cookie", success: true});
    }
    else {
        res.status(401).json({message: "No refresh Token!", success: false});
    }
}
const getUser = async (req, res) => {
    const accessToken = req.headers;
}

//Log off user, remove cookies from the user's browser
const logoutUser = async (req, res) => {
    //const {authorization} = req.headers;
    //console.log("Header: ", authorization.split(" ")[1]);
    res.clearCookie("refreshToken");
    res.status(201).json({message: "Logout successful!", success: true})
}

export {loginUser, signupUser, verifyCookie, logoutUser, refreshToken}