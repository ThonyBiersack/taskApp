import mongoose, { Schema, SchemaTypes, model } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    deadline: Date,
    status: {
        type: String,
        enum: ['active', 'done'],
        default: 'active'
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default model('Task', taskSchema);