import { cartModel } from "./models/cart.model.js";

export class CartManagerMongo {
    async addCart() {
        try {
            let carrito = await cartModel.create({
                products:[]
            })
            return carrito
        } catch (error) {
            if (error) {
                console.log('error al crear el carrito ' + error);
            }
        }
    }

    async getCartById(id) {
        return await cartModel.findOne({_id: id}).lean()
    }

    async getCart(){
        let carritos = await cartModel.find()
        
        return carritos
    }
}