import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/test`);
        console.log("connected");
    } catch (err) {
        console.error(err);
    }
};

export default connection;
