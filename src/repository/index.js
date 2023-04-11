import CartRepository from "./cart.repository.js";
import ProductRepository from "./products.repository.js";
import TicketRepository from "./ticket.repository.js";

export const productRepository = new ProductRepository();
export const cartRepository = new CartRepository();
export const ticketRepository = new TicketRepository()