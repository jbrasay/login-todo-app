import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

const createSecretToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_KEY, {expiresIn: "1800s"});
};

export default createSecretToken;