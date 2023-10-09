

import express from "express";
import { validateSignIn, validateSignUp, validateUpdate, validateChangePass } from "./usersValidation.js";
import { signUp, signIn, verifyAccount, changePassword, updateUser, deleteUser, softDeleteUser, userLogout } from "./users.controller.js";
import { authorization } from "../../utils/token.js";

const userRouter = express.Router();

userRouter.post("/users/signup", validateSignUp, signUp);
userRouter.post("/users/signin", validateSignIn, signIn);
userRouter.get("/users/verify/:id", verifyAccount);
userRouter.patch("/users/changepass", authorization, validateChangePass, changePassword);
userRouter.patch("/users/update", authorization, validateUpdate, updateUser);
userRouter.get("/users/delete", authorization, deleteUser);
userRouter.get("/users/softdelete", authorization, softDeleteUser);
userRouter.get("/users/logout", authorization, userLogout);

export default userRouter;
