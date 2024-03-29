import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = mongoose.Schema({
    code: String,
    purchase_datetime: String,
    amount: Number,
    purchaser: String
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema)