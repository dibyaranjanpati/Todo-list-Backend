import express from "express";
import usersRouter from "./routes/user.route.js";
import { authenticateUser, ensureAuthentication } from "./middlewares/auth.js";
import todosRouter from "./routes/todos.router.js";

const app = express();

const PORT = process.env.PORT ?? 8000;
app.use(express.json());
app.use("/todos", authenticateUser);

app.get("/", (req, res) => {
  res.json({ status: "the todo port is running" });
});
app.use(usersRouter);
app.use(todosRouter);
app.listen(PORT, () => console.log(`the server is running on port ${PORT} `));
