import { productModel } from "../dao/models/product.model.js";
import { premiumProd } from "../utils.js";

export default class ProductRepository {
    async get (){
        return await productModel.find().lean(); 
    }

    async getById(id) {
        return  await productModel.findOne({_id: id});
    }

    async createProduct(params) {
        let title = params.title;
        let description = params.description;
        let price = params.price;
        let thumbnail = params.img;
        let code = params.code;
        let stock = params.stock;
        let owner = params.owner
        await productModel.create({title: title, description: description, price: price, thumbnail:thumbnail, code:code, stock: stock, status: true, owner: owner})
    }

    async updateProduct (id, campo, valor) {
        await productModel.updateOne({_id: id}, {$set: {[campo]: valor}})
    } 

    async deleteProduct (id) {
        await premiumProd(id)
        await productModel.deleteOne({_id: id})
    }
}