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
    rol: {
        type: String,
        default: 'user'
    },
    last_login: {
        type: String,
        default: 'no login'
    },
    carrito:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cart'
    }

})

export const userModel = mongoose.model(userCollection, userSchema)