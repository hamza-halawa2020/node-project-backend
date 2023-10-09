import express from "express";
import connection from "./db/connection.js";
import userRouter from "./modules/users/users.routes.js";
import taskRouter from "./modules/tasks/tasks.routes.js";


const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

connection();
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});