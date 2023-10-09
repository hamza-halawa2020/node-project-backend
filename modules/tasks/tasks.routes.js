import express from "express";
import { createAuthorization } from "../../utils/token.js";
import { addNewTask, update, deleteMyTask, searchTaskByIdUSer } from "./tasks.controller.js";
import { addTask, updateTask, deleteTask } from "./tasksValidation.js";

const taskRouter = express.Router();

taskRouter.post("/tasks", createAuthorization, addTask, addNewTask);
taskRouter.patch("/tasks", createAuthorization, updateTask, update);
taskRouter.delete("/tasks", createAuthorization, deleteTask, deleteMyTask);
taskRouter.get("/taskswithusers", createAuthorization, searchTaskByIdUSer);

export default taskRouter;
