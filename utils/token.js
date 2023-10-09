import jwt from "jsonwebtoken";

const secretKey = "hamza halawa";

const authorization = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, secretKey);
        req.userID = user.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "wrong" });
    }
};


const createAuthorization = (user, ex) => {
    const token = jwt.sign(user, secretKey, { expiresIn: ex });
    return token;
};

export { authorization, createAuthorization };
