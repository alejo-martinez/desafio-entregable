import { ticketModel } from "../dao/models/ticket.model.js";

export default class TicketRepository {
    async createTicket (codigo, fecha, monto, purchaser) {
        const ticket = await ticketModel.create({
            code: codigo,
            purchase_datetime:fecha,
            amount: monto,
            purchaser: purchaser
        })
        return ticket;
    }
}