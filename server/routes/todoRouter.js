import express from "express";
import { getAllTodos, addTodo, removeTodo, changeTodoStatus, changeTodoDesc } from "../controllers/todoController.js";
import userVerification from "../middleware/userVerification.js";

const todoRouter = express.Router();

todoRouter.get("/getAllTodos", userVerification, getAllTodos);
todoRouter.post("/addTodo", userVerification, addTodo);
todoRouter.delete("/removeTodo", userVerification, removeTodo);
todoRouter.patch("/changeTodoStatus", userVerification, changeTodoStatus);
todoRouter.patch("/changeTodoDesc", userVerification, changeTodoDesc)
export default todoRouter;