import User from "../../schemas/users.schema.js";
import Task from "../../schemas/tasks.schema.js";
import bcrypt from "bcrypt";
import { authorization } from "../../utils/token.js";
import sendEmail from "../../utils/sendMail.js";

//sign up 
const signUp = async (req, res) => {
    const { name, email, password, age, gender, phone } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({
                message: "User already exists",
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const createUser = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            phone,
        });

        sendEmail({ name, email, id: createUser._id });
        res.status(200).json({
            message:
                "User is successfully created. please verify your account",
            user: createUser,
        });
    } catch (error) {
        console.log(error, res);
    }
};

//sign in
const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || user.isDeleted) {
            return res.status(403).json({
                message: user?.isDeleted
                    ? "Your account deleted"
                    : "Email is not correct",
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message:
                    "You must verify your account",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = authorization(
                {
                    id: user._id,
                    email: user.email,
                },
                "7d"
            );
            res.status(200).json({
                message: "User is successfully logged in",
                token,
            });
        } else {
            res.status(406).json({
                message: "wrong password",
            });
        }
    } catch (error) {
        console.log(error, res);
    }
};

//verify account
const verifyAccount = async (req, res) => {
    const id = req.params.id;

    if (id.length !== 24) {
        return res.status(404).json({ message: "User id is invalid" });
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User id is invalid" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isVerified: true },
            { new: true }
        );

        res.status(200).json({
            message: "verified successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error, res);
    }
};

const changePassword = async (req, res) => {
    const id = req.userID;

    try {
        const userData = await User.findById(id);

        if (!userData || userData.isDeleted) {
            const expiredToken = authorization(
                { id: userData?._id }
            );
            return res.status(403).json({
                message: userData?.isDeleted
                    ? "Your account has been deleted"
                    : "Can't find your account",
                token: expiredToken,
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const user = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        const token = authorization({ id, email: user.email });

        res.status(200).json({
            message: "Password is updated",
            newToken: token,
        });
    } catch (error) {
        console.log(error, res);
    }
};


const updateUser = async (req, res) => {
    const id = req.userID;
    const { name, age, phone } = req.body;

    try {
        const userData = await User.findById(id);

        if (!userData || userData.isDeleted) {
            const expiredToken = authorization(
                { id: userData?._id }
            );

            return res.status(403).json({
                message: userData?.isDeleted
                    ? "Your account has been deleted"
                    : "Can't find your account",
                token: expiredToken,
            });
        }

        const updatedData = {};

        if (name) updatedData.name = name;
        if (age) updatedData.age = age;
        if (phone) updatedData.phone = phone;

        const newData = await User.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        );

        res.status(200).json({
            message: "User is updated successfully",
            updatedUser: newData,
        });
    } catch (error) {
        console.log(error, res);
    }
};


const deleteUser = async (req, res) => {
    const id = req.userID;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(403).json({
                message: "Can't find your account",
            });
        }

        await Task.deleteMany({ userID: id });
        await User.findByIdAndDelete(id);

        const expiredToken = authorization({ id: user._id }, "1s");
        res.status(200).json({
            message: "Your account deleted",
            token: expiredToken,
        });
    } catch (error) {
        console.log(error, res);
    }
};
//delete user and the tasks
const softDeleteUser = async (req, res) => {
    const id = req.userID;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(403).json({
                message: "Can't find your account",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        const expiredToken = authorization({ id: updatedUser._id }, "1s");
        res.status(403).json({
            message:
                "Your account has been deleted",
            token: expiredToken,
            user: updatedUser,
        });
    } catch (error) {
        console.log(error, res);
    }
};


const userLogout = async (req, res) => {
    const id = req.userID;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(403).json({
                message: "Can't find your account",
            });
        }

        const expiredToken = authorization({ id: user._id }, "1s");

        if (user.isDeleted) {
            return res.status(403).json({
                message:
                    "Your account has been deleted",
                token: expiredToken,
            });
        }

        res.status(200).json({
            token: expiredToken,
        });
    } catch (error) {
        console.log(error, res);
    }
};

export {
    signUp,
    signIn,
    verifyAccount,
    changePassword,
    updateUser,
    deleteUser,
    softDeleteUser,
    userLogout,
};
