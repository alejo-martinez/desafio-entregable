import ProductDTO from "../dao/DTOs/product.dto.js";
import { productModel } from "../dao/models/product.model.js";


export default class ProductRepository {
    async get (){
        return await productModel.find().lean(); 
    }

    async getById(id) {
        return  await productModel.find({_id: id});
    }

    async createProduct(params) {
        // const {title, description, price, thumbnail, code, stock} = params;
        let title = params.title;
        let description = params.description;
        let price = params.price;
        let thumbnail = params.img;
        let code = params.code;
        let stock = params.stock;
        await productModel.create({title: title, description: description, price: price, thumbnail:thumbnail, code:code, stock: stock, status: true})
    }

    async updateProduct (id, campo, valor) {
        await productModel.updateOne({_id: id}, {$set: {[campo]: valor}})
    } 

    async deleteProduct (id) {
        await productModel.deleteOne({_id: id})
    }
}