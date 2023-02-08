import mongoose from "mongoose";

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    products: Array
})

export const cartModel = mongoose.model(cartCollection, cartSchema)