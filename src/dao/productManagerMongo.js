import { productModel } from "./models/product.model.js";

export class ProductManagerMongo {
    constructor (){
        this.array = []
    }

    async getProduct () {
        try {
            let productos = await productModel.find().lean()
            return productos;
        } catch (error) {
            if (error) {
                console.log('error al leer el archivo');
            }
        }
    }

    async getProductById(id){
        try {
            let producto = await productModel.find({_id: id})
            if (!producto) {
                console.log('el producto que estas buscando no existe');
            } else{
                return producto
            }
        } catch (error) {
            if (error) {
                console.log('error al buscar el producto solicitado');
            }
        }
    }

    async addProduct (title, description, price, code, stock){
        try {
            let producto = await productModel.create({
            title: title,
            description: description,
            price: price,
            thumbnail: 'nada',
            code: code,
            stock: stock,
            status: true
            })
            return producto
        } catch (error) {
            if (error) {
                console.log('error al crear el producto');
            }
        }
    }

    async updateProduct(id, campo, valor) {
        try {
            let productoActualizado = await productModel.updateOne({_id: id}, {$set: {[campo]: valor}})
            return productoActualizado;
        } catch (error) {
            if (error) {
             console.log('error al actualizar el producto');   
            }
        }
    }

    async deleteProduct(id) {
        try {
            await productModel.deleteOne({_id: id})
        } catch (error) {
            if (error) {
                console.log('error al borrar el producto');
            }
        }
    }
}