import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

/**
 * This is a middleware for authenticating users
 * Retrieve the access token from the header, check if expired
 * Return an error code 403 if expired
 * Go to the next function if access token has not expired
 * @param {*} req From the client
 * @param {*} res Response send to the next function of the endpoint
 * @param {*} next Go to the next function of the endpoint
 */

const userAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    //console.log("Header: ", authorization.split(" ")[1]);
    if (!authorization) {
        return res.status(403).json({status: false, message:"No Access Token Found!"});
    }
    const accessToken = authorization.split(" ")[1];
    //console.log("Access Token: ", accessToken);
    jwt.verify(accessToken, process.env.AUTH_ACCESS_TOKEN_SECRET, async (error, decoded) => {
        if (error) {
            //Handle invlaid or expired access token
            //console.log("Expired!");
            res.status(403).json({message: "Invalid or expired access token", success: false})
        } 
        else {
            //console.log(user._id);
            //console.log("Not Expired");
            //If Access token is still valid, store decoded token in req.user, then go to the next function
            req.user = decoded;
            next();
        }
    })
}

export default userAuth;