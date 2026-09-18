import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minLength: 8 },
}, { timestamps: true })

export default model('Users', userSchema);