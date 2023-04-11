import mongoose from "mongoose";

const userCollection = 'user'

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    admin: {
        type: Boolean
    }
})

export const userModel = mongoose.model(userCollection, userSchema)