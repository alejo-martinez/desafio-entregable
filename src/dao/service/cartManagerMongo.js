import { cartModel } from "../models/cart.model.js";
import { cartRepository } from "../../repository/index.js";
export class CartManagerMongo {
    async addCart() {
        try {
            cartRepository.createCart();
        } catch (error) {
            if (error) {
                console.log('error al crear el carrito ' + error);
            }
        }
    }

    async getCartById(id) {
        try {
            return cartRepository.getById(id)
        } catch (error) {
            if(error) console.log('error al obtener el carrito ' + error);
        }
    }

    async getCart(){
        try {
            return cartRepository.get();
        } catch (error) {
            if(error) console.log('error al obtener los carritos ' + error);
        }

    }
}