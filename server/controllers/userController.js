
import UserModel from "../models/UserModel.js"; 
import bcrypt from "bcrypt" 
import validator from "validator"
import jwt from "jsonwebtoken"
import {createAccessToken, createRefreshToken} from "../util/secretToken.js";
import dotenv from "dotenv"
dotenv.config();

/**
 * Function for the endpoint to log in a user
 * Checks if email and password is not empty, then find the user
 * If user does not exist send a error code
 * If user exist, create a refresh token and access token, and send to user
 * @param {*} req Received from the client
 * @param {*} res Send to the client
 * @param {*} next Go to the next function
 * @returns Status code annd json object
 */
const loginUser = async (req, res, next) => {
    //console.log("Request Body: ", req.body);
    //const {Authorization} = req.headers;
    //console.log("Header: ", Authorization);
 
    try {
        //Initialize email and password
        const {email, password} = req.body;
        //Check if email and password field is not empty, send error status code and json object
        if (validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).json({message: "Please fill all fields", success: false});
        };

        //Check if user exist
        const user = await UserModel.findOne({email});
        //console.log(user._id);
        //If user is not in database, send error status code and json object
        if (!user) {
            return res.status(404).json({message: "User does not exist!", success: false});
        };

        //Check if user entered the correct password
        const auth = await bcrypt.compare(password, user.password);
        //If user password is incorrect, send error status code and json object
        if (!auth) {
            return res.status(401).json({message: "Incorrect password!", success: false})
        };

        //Create access and refresh tokens
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        //console.log("Refresh: ",refreshToken)
        //Send refresh token as cookies to the client
        res.cookie("refreshToken", refreshToken, {
            //withCredentials: true,
            httpOnly: true,
            expires: new Date(Date.now() + 86400000), //Expires in 24 hours
        });
        //when log in is successful return a 200 status code along with message, success status, the user object, and accessToken
        res.status(200).json({message: "User logged in successfully", success: true, user: user, accessToken: accessToken});
        //console.log("Email: " + email);
        //console.log("Password: " + password)
    } catch(error) {
        res.status(500).json({message: error.message, success: false});
    }

}


/**
 * Function for the endpoint to create a new account for a user
 * @param {*} req Received from the client
 * @param {*} res Send to the client
 * @param {*} next Go to the next function
 * @returns Status code annd json object
 */
const signupUser = async (req, res, next) => {
    
    try {
        //Initialize email, username, password, and createdAt 
        const {email, username, password, createdAt} = req.body;
        //console.log("CreatedAt: ",createdAt);
        //console.log(req.cookies.token);   
        //console.log("Email" + email);
        
        //Check if username, email, and password is empty
        if (validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).json({message: "Please fill all fields", success: false});
        }
        //Check if email is valid, send error status code
        if (!validator.isEmail(email)) {
            return res.status(400).json({message: "Please enter a valid email", success: false});
        }
        //Check if password meets the requirements, send error status code
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({message: "Password does not meet requirements: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1", success: false})
        }
        
        //Check if user already exist, send error status code
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
        //Create access and refresh tokens
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        //console.log("Token: " + token);        
        
        //Send refresh token as cookies to the client
        res.cookie("refreshToken", refreshToken, {
            //withCredentials: true,
            httpOnly: true,
            expires: new Date(Date.now() + 86400000), //Expires in 24 hours
        });

        //when signup is successful return a 201 status code along with message, success status, the user object, and accessToken
        res.status(201).json({message: "Account created successfully", success: true, user: user, accessToken: accessToken});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

/**
 *  * 
 * Store the cookie refresh token
 * Check if its not null, else return a 401 status no refresh token message
 * If refresh exist, verify if token is expired or invalid, return a 401 status 
 * If reresh token is valid, create a new access token and retrieve the user using the id from the refresh token.
 * Send 201 status response to the client containing the new refresh token and user data
 * 
 * @param {*} req The request received from the client
 * @param {*} res The response sent to the client
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

/**
 * Function for the endpoint to refresh an access token
 * @param {*} req Received from the client
 * @param {*} res Send to the client
 * @returns Status code annd json object
 */
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
                const accessToken = createAccessToken(decoded.id);
                //const user = await UserModel.findById(decoded.id);
                //console.log("Verify Cookie USer: ", user);
                res.status(201).json({message: "New Access Token Created!", success: true, accessToken});
            }
        });
    }
    else {
        res.status(401).json({message: "No refresh Token!", success: false});
    }
}

/**
 * Function for the endpoint to log out a user
 * Remove cookies from the clients browser
 * @param {*} req Received from the client
 * @param {*} res Send to the client
 * @returns Status code and json object
 */
const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(201).json({message: "Logout successful!", success: true})
}

export {loginUser, signupUser, verifyCookie, logoutUser, refreshToken}