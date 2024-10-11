//Import mongoose
import mongoose from "mongoose";
//Import ENV variables
import dotenv from "dotenv"
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(uri, {    
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(error.message);
        //Exit process
        process.exit(1);
    }
}

export default connectToDB;