import mongoose from "mongoose";

const user = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: Number,
        gender: {
            type: String,
            enum: ["male", "female"],
        },
        phone: {
            type: String,
            min: 7,
            max: 14,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", user);
export default User;
