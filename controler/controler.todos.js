import { and, desc, eq } from "drizzle-orm";
import db from "../db/index.js";
import { todosTable } from "../models/todos.model.js";
import { usersTable } from "../models/users.model.js";

// create todos controler
export async function createTodos(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || title === "") {
      return res.status(404).json({ error: "the title is required" });
    }
    // get the user id from the auth middleware
    const userId = req.user.id;

    // store the todos on db
    await db
      .insert(todosTable)
      .values({ title, description, userId })
      .returning({ id: todosTable.id });

    return res.status(201).json({ message: "your todo create successfully " });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// get all todos by the user controler
export async function getAllTodosByUser(req, res) {
  try {
    // Get the userId from the authenticated request
    const userId = req.user.id;

    //  Fetch todos where the user_id matches
    const userTodos = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.userId, userId))
      .orderBy(desc(todosTable.createdAt)); // for short todos by the time

    // return the data in list
    return res.status(200).json({
      success: true,
      count: userTodos.length,
      data: userTodos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
}

// get todo by the specific id
export async function getTodoById(req, res) {
  // got the req  todo id
  const id = req.params.id;

  // got login userId
  const userId = req.user.id;

  const [todo] = await db
    .select()
    .from(todosTable)
    .where(and(eq(todosTable.id, id), eq(todosTable.userId, userId))); // verify that the user who req the todo is that own

  if (!todo) {
    return res
      .status(400)
      .json("todo which you did not exist in your todos list");
  }

  return res.status(200).json(todo);
}
// update todo by id
export async function updateTodoById(req, res) {
  try {
    // got the req  todo id
    const id = req.params.id;

    // got login userId
    const userId = req.user.id;

    const { title, description } = req.body;

    // updating the data by verifying the user id and todo id
    const [updatedTodo] = await db
      .update(todosTable)
      .set({ title, description, updatedAt: new Date() })
      .where(and(eq(todosTable.id, id), eq(todosTable.userId, userId)))
      .returning();

    //  If no record was updated (either wrong ID or wrong User)
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you do not have permission to edit it.",
      });
    }

    //  Success response
    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

// delete todos
export async function deleteTodosById(req, res) {
  try {
    // got the req  todo id
    const id = req.params.id;

    // got login userId
    const userId = req.user.id;

    const [deletedTodo] = await db
      .delete(todosTable)
      .where(and(eq(todosTable.id, id), eq(todosTable.userId, userId)))
      .returning();

    // 2. If no record was deleted, it means the ID or the Owner was wrong
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you do not have permission to delete it.",
      });
    }

    // 3. Success response
    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      deletedId: deletedTodo.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}
