import fs from 'fs'
import { ProductManager, CartManager } from './index.js'

let pm = new ProductManager('../productos.json')
let cm = new CartManager('../cart.json')



const cartOcupped = async() => {
    const arrayCarts = await cm.getCarts()
    for (let i= 0; i < arrayCarts.length; i++) {
        const element = arrayCarts[i].products
        if (element.length !== 0) {
           return element
        }
    }
}

const productosActuales = async () =>{
    let cartConProd = await cartOcupped()
    const prodActuales = []
    const arrayProds = await pm.getProduct()
    for (let i = 0; i < arrayProds.length; i++) {
        const element = arrayProds[i];
        // const cantidad = cartConProd[i].quantity
        if (element.id === cartConProd[i].id) {
            prodActuales.push(element)
            return prodActuales
        }
    }
}

console.log(await productosActuales());


export default cartOcupped