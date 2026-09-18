import jwt from "jsonwebtoken";

const generate = (user) => {
    return jwt.sign({
        userId: user._id,
        username: user.username
    },
        process.env.KEY,
        { expiresIn: '5h' })
}
export default generate;