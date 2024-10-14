import express from "express";
import { getAllTodos, addTodo, removeTodo, changeTodoStatus, changeTodoDesc } from "../controllers/todoController.js";
import authUser from "../middleware/authUser.js";

const todoRouter = express.Router();

todoRouter.get("/getAllTodos", authUser, getAllTodos);
todoRouter.post("/addTodo", authUser, addTodo);
todoRouter.delete("/removeTodo", authUser, removeTodo);
todoRouter.patch("/changeTodoStatus", authUser, changeTodoStatus);
todoRouter.patch("/changeTodoDesc", authUser, changeTodoDesc)
export default todoRouter;