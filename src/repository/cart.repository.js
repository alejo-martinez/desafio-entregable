import CartDTO from "../dao/DTOs/cart.dto.js";
import { cartModel } from "../dao/models/cart.model.js";

export default class CartRepository {
    async createCart () {
        let cart = new CartDTO()
        let carrito = await cartModel.create(cart)
        return carrito;
    }

    async getById (id) {
        return await cartModel.findOne({_id: id}).lean();
    }

    async get () {
        let carritos = await cartModel.find();
        return carritos
    }
}