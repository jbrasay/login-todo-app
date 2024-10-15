import todoModel from "../models/todoModel.js";
import validator from "validator";

/**
 * Fetch all the todos for the user that is logged on
 * @param {*} req From the client, get the UserID
 * @param {*} res Send to the client, the todos data 
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

/**
 * Create a new todo using user ID, todo description and status
 * Add the new todo to the database
 * @param {*} req From the client, get the UserID, todo description and the status
 * @param {*} res Send to the client, the todo data  
 */
const addTodo = async (req, res) => {
    const userID = req.user.id;
    const {todoDesc, todoStatus} = req.body;
    //console.log(req.body);
    try {
        //Check if input is empty, return an error code and message
        if (validator.isEmpty(todoDesc)) {
            return res.status(400).json({message: "Please fill all fields", success: false});
        }
        //Create the new todo in the database
        const todo = await todoModel.create({userID, todoDesc, todoStatus});
        //console.log(todo);
        res.status(200).json({message: "Todo added successfully!", success: true, resData: todo});
        //res.status(200).json({message: "Todo added successfully!", success: true});
    } catch(error) {
        res.status(500).json({message: error.message, success: false});
    }
};


/**
 * Remove the todo from the database using the todo ID
 * @param {*} req From the client, get the todo id
 * @param {*} res Send to the client , the status code, and message 
 */
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

/**
 * Change the status of the todo data
 * Find the data in the database using the todo ID and update the status
 * @param {*} req From the client, get the todo ID, and the todo status
 * @param {*} res Send to the client, the todo data  
 */
const changeTodoStatus = async (req, res) => {
    const {todoID, todoStatus} = req.body;
    //console.log(todoStatus);
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


/**
 * Update the todo description
 * Find the data in the database using the todo ID and update the description
 * @param {*} req From the client, get the todo ID and todo description
 * @param {*} res Send to the client, the todos data  
 */
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