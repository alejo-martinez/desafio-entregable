import CartRepository from "./cart.repository.js";
import ProductRepository from "./products.repository.js";

export const productRepository = new ProductRepository();
export const cartRepository = new CartRepository();