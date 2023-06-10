import CartDTO from "../dao/DTOs/cart.dto.js";
import { cartModel } from "../dao/models/cart.model.js";

export default class CartRepository {
    async createCart () {
        let cart = new CartDTO();
        return await cartModel.create(cart);
    }

    async getById (id) {
        return await cartModel.findOne({_id: id}).lean();
    }

    async get () {
        return await cartModel.find().lean();
    }

    async getPopulate (cid) {
        return await cartModel.find({_id: cid}).lean().populate('products.product')
    }

    async updateProductsId (id, valor) {
        await cartModel.updateOne({_id: id}, {$set: {products:valor}})
    }
}