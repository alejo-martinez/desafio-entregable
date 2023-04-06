import { productModel } from "../models/product.model.js";
import { __dirname } from "../../utils.js";
import { productRepository } from "../../repository/index.js";
export class ProductManagerMongo {
    constructor (){
        this.array = []
    }

    async getProduct () {
        try {
            productRepository.get()
        } catch (error) {
            if (error) {
                console.log('error al leer el archivo');
            }
        }
    }

    async getProductById(id){
        try {
            let producto = productRepository.getById(id)
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

    async addProduct (title, description, price, img, code, stock){
        try {
            let producto = productRepository.createProduct({title, description, price, img, code, stock})
            return producto
        } catch (error) {
            if (error) {
                console.log('error al crear el producto');
            }
        }
    }

    async updateProduct(id, campo, valor) {
        try {
            productRepository.updateProduct(id, campo, valor)
        } catch (error) {
            if (error) {
             console.log('error al actualizar el producto');   
            }
        }
    }

    async deleteProduct(id) {
        try {
            productRepository.deleteProduct(id)
        } catch (error) {
            if (error) {
                console.log('error al borrar el producto');
            }
        }
    }
}