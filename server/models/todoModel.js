import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    todoDesc: {
        type: String,
        required: true,
    },
    todoStatus: {
        type: Boolean,
        required: true,
    }
});

const todoModel = mongoose.model("Todo", todoSchema);

export default todoModel;
