import fs from 'fs'

class Cart {
    constructor(id, products){
        this.id = id;
        this.products = products;
    }

}

export class CartManager {
    constructor(path){
        this.path = path
    }

    async addCart (){
        let cart = new Cart(modificarIdCarrito(), [])
        arrayCarritos.push(cart)
        await fs.promises.writeFile('../cart.json', JSON.stringify(arrayCarritos, null, 2))
        }

    async getCartById(id) {
        const archivoCarritos = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        return archivoCarritos.find(cart => cart.id === parseFloat(id))
    }    

    async getCarts() {
        return JSON.parse( await fs.promises.readFile(this.path, 'utf-8'))
    }

}