import mongoose from "mongoose";

const userCollection = 'user'

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    last_name: {
        // required: true,
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        // required: true,
        type: String
    },
    rol: String
})

export const userModel = mongoose.model(userCollection, userSchema)