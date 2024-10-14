import express from "express"
import connectToDB from "./database.js";
import userRouter from "./routes/userRouter.js";
import todoRouter from "./routes/todoRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config();

const app = express();
//Cross origin access
app.use(cors({
    //Allow request from the specified host
    origin: [process.env.CLIENT_HOST],
    methods: ["GET", "PATCH","POST", "PUT", "DELETE"],
    credentials: true,
}));
//Add body propery to req object
app.use(express.json());
//Add cookies to req object
app.use(cookieParser());

//Endpoint
app.use("/user", userRouter);
app.use("/todo", todoRouter);

const port = process.env.PORT;

const startServer = async () => {
    await connectToDB();
    app.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
    } )
}

startServer();