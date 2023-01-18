import fs from 'fs'
import { ProductManager, CartManager } from './index.js'

let pm = new ProductManager('../productos.json')
let cm = new CartManager('../cart.json')



const productosActuales = async() => {
    const prodActuales = []
    const arrayCarts = await cm.getCarts()
    const arrayProds = await pm.getProduct()
    
    arrayCarts.forEach(cart => {
        console.log(cart.products.find(prod => prod.id == 1));
    })
    

// NO PUEDO ACCEDER A CART.PRODUCTS Y BUSCAR EL ID DEL PROD
    

}
await productosActuales()

// console.log();

export default productosActuales