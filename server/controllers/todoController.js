import todoModel from "../models/todoModel.js";
import validator from "validator";

/**
 * 
 * @param {*} req From the client
 * @param {*} res Send to the client
 */
const getAllTodos = async (req,res) => {
    //const userID = req.user._id;
    const userID = req.user.id;
    //console.log("USER ID: ", userID);
    //console.log(userID);
    try {
        const todos = await todoModel.find({userID})
        res.status(200).json({success: true, data: todos});
        //res.status(200).json({success: true});
    } catch(error) {
        res.status(500).json({message: error.message, success: false});
    }
};

//Add a todo for the specific user ID
const addTodo = async (req, res) => {
    //console.log(req.user);
    //console.log(req.token);

    const userID = req.user.id;
    const {todoDesc, todoStatus} = req.body;
    //console.log(req.body);

    try {
        if (validator.isEmpty(todoDesc)) {
            return res.status(400).json({message: "Please fill all fields", success: false});
        }
        const todo = await todoModel.create({userID, todoDesc, todoStatus});
        //console.log(todo);
        res.status(200).json({message: "Todo added successfully!", success: true, resData: todo});
        //res.status(200).json({message: "Todo added successfully!", success: true});
    } catch(error) {
        res.status(500).json({message: error.message, success: false});
    }
};

const removeTodo = async (req, res) => {
    //Extract the todoID from request query
    const {todoID} = req.query;
    //console.log(todoID);
    try {
        const todo = await todoModel.findByIdAndDelete(todoID);
        res.status(200).json({message: "Todo succesfully deleted!", success: true, resData: todo});
        //res.status(200).json({message: "Todo successfully deleted!", success: true, data: todoID});
    } catch(error) {
        res.status(400).json({message: error.message, success: false})
    }
};

const changeTodoStatus = async (req, res) => {
    const {todoID, todoStatus} = req.body;
    //console.log(todoStatus);
    //const options = {new: true};

    try {
        //Return the updated document
        const options = {new: true};
        const todo = await todoModel.findByIdAndUpdate(todoID,{todoStatus}, options);
        res.status(200).json({message: "Todo status successfully updated!", success: true, resData: todo})
        //res.status(200).json({message: "Todo status successfully updated!", success: true})
    } catch(error) {
        res.status(400).json({message: error.message, success: false});
    }
};

const changeTodoDesc = async (req, res) => {
    const {todoID, todoDesc} = req.body;
    try {
        //Return the updated document
        const options = {new: true};
        const todo = await todoModel.findByIdAndUpdate(todoID, {todoDesc}, options);
        res.status(200).json({message: "Todo description successfully updated", success: true, resData: todo});
        //res.status(200).json({message: "Todo description successfully updated", success: true});
    } catch(error) {
        res.status(400).json({message: error.message, success: false});
    }
}

export {getAllTodos, addTodo, removeTodo, changeTodoStatus, changeTodoDesc}