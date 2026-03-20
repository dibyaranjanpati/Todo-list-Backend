import express from "express";
import { authenticateUser, ensureAuthentication } from "../middlewares/auth.js";
import {
  createTodos,
  deleteTodosById,
  getAllTodosByUser,
  getTodoById,
  updateTodoById,
} from "../controler/controler.todos.js";

const router = express.Router();

// create todos router
router.post("/todos", authenticateUser, createTodos);

// get all todos by the user
router.get("/todos", authenticateUser, getAllTodosByUser);

// get todo by id
router.get("/todos/:id", authenticateUser, getTodoById);

// update todos
router.post("/todos/:id", authenticateUser, updateTodoById);

// delete todos
router.delete("/todos/:id", authenticateUser, deleteTodosById);

export default router;
