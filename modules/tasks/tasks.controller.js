import User from "../../schemas/users.schema.js";
import Task from "../../schemas/tasks.schema.js";
import { createAuthorization } from "../../utils/token.js";

//check user is deleted
const UserStatus = async (usersID) => {
    const users = await User.findById(usersID);
    if (!users || users.isDeleted) {
        return {
            status: users?.isDeleted ? 403 : 404,
            message: users?.isDeleted
                ? "Your account deleted"
                : "Can't find your account",
            token: users?.isDeleted
                ? createAuthorization({ id: users._id })
                : null,
        };
    }
    return { status: 200 };
};

// add new task 
const addNewTask = async (req, res) => {
    const {
        userID,
        body: { title, description, assignTo, deadline },
    } = req;

    try {
        const status = await UserStatus(userID);
        if (status.status !== 200) {
            return res.status(status.status).json({
                message: status.message,
                token: status.token,
            });
        }

        const task = await Task.create({
            title,
            description,
            status: "test",
            userID,
            assignTo,
            deadline,
        });
        res.status(200).json({
            message: "added successfully",
            task,
        });
    } catch (error) {
        console.log();(error);
    }
};
//update the rask
const update = async (req, res) => {
    const {
        userID,
        body: { id, title, description, status },
    } = req;

    try {
        const status = await UserStatus(userID);
        if (status.status !== 200) {
            return res.status(status.status).json({
                message: status.message,
                token: status.token,
            });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "not found" });
        }

        if (task.userID.toString() !== userID) {
            return res.status(400).json({
                message: "You can't update this task",
            });
        }

        const dataUpdated = {};
        if (title) dataUpdated.title = title;
        if (description) dataUpdated.description = description;
        if (status) dataUpdated.status = status;

        const newData = await Task.findByIdAndUpdate(
            id,
            { $set: dataUpdated },
            { new: true }
        );
        res.json({
            message: "updated successfully",
            updatedTask: newData,
        });
    } catch (error) {
        console.log(error);
    }
};

//delete my task
const deleteMyTask = async (req, res) => {
    const {
        userID,
        body: { id },
    } = req;

    try {
        const status = await UserStatus(userID);
        if (status.status !== 200) {
            return res.status(status.status).json({
                message: status.message,
                token: status.token,
            });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "not found" });
        }

        if (task.userID.toString() !== userID) {
            return res.status(400).json({
                message: "You can't delete this task",
            });
        }

        const done = await Task.findByIdAndDelete(id);
        res.json({
            message: "deleted ",
            deletedTask: done,
        });
    } catch (error) {
        console.log(error);
    }
};

//search tasks with id
const searchTaskByIdUSer = async (_, res) => {
    try {
        const tasks = await Task.find().populate(
            "userID",
            "_id name age gender phone"
        );
        const message = tasks.length
            ? "done"
            : "not found";

        res.status(200).json({ message, tasks });
    } catch (error) {
        console.log(error);
    }
};




export { addNewTask, update, deleteMyTask, searchTaskByIdUSer };
