import ProductDTO from "../dao/DTOs/product.dto.js";
import { productModel } from "../dao/models/product.model.js";


export default class ProductRepository {
    async get (){
        let objetos = await productModel.find().lean();
        return objetos; 
    }

    async getById(id) {
        let objeto = await productModel.find({_id: id});
        return objeto;
    }

    async createProduct(params) {
        let title = params.title;
        let description = params.description;
        let price = params.price;
        let thumbnail = params.img;
        let code = params.code;
        let stock = params.stock;
        let producto = new ProductDTO({title, description, price, thumbnail, code, stock})
        return producto
    }

    async updateProduct (id, campo, valor) {
        let productoActualizado = await productModel.updateOne({_id: id}, {$set: {[campo]: valor}})
        return productoActualizado;
    } 

    async deleteProduct (id) {
        await productModel.deleteOne({_id: id})
    }
}