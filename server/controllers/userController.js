
import UserModel from "../models/UserModel.js"; 
import bcrypt from "bcrypt" 
import validator from "validator"
import createSecretToken from "../util/secretToken.js";


const loginUser = async (req, res, next) => {
    //console.log(req.body);
    //console.log(req.cookies);
    /*
    if (req.cookies.token) {
        console.log("I have token!");
    }
    */
    try {
        //Deconstruct email and password from the request body
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
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            //withCredentials: true,
            httpOnly: true,
            expires: new Date(Date.now() + 86400000), //Expires in 24 hours
        });
        
        //Send success message
        res.status(201).json({message: "User logged in successfully", success: true});
        //console.log("Email: " + email);
        //console.log("Password: " + password)
        next();
    } catch(error) {
        res.status(500).json({message: error.message});
    }

}

const signupUser = async (req, res, next) => {
    //console.log(req);
    console.log(req.body);
    
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

        const token = createSecretToken(user._id);
        //console.log("Token: " + token);        
        //Send the token as a cookie to the user
        
        res.cookie("token", token, {
            //Cross-site access control request
            //withCredentials: true,
            httpOnly: true,
            expires: new Date(Date.now() + 86400000),
        })
        
        res.status(201).json({message: "Account created successfully", success: true});
        next();
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

//Log off user, remove cookies from the user's browser
const logoutUser = async (req, res) => {
    res.clearCookie('token');
    res.status(201).json({message: "Logout successful!", success: true})
}
export {loginUser, signupUser, logoutUser}