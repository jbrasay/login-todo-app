import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

const createAccessToken = (id) => {
    return jwt.sign({id}, process.env.AUTH_ACCESS_TOKEN_SECRET, {expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY});
};

const createRefreshToken = (id) => {
    return jwt.sign({id}, process.env.AUTH_REFRESH_TOKEN_SECRET, {expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY});
}
export {createAccessToken, createRefreshToken};