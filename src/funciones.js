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
    
    cartConProd.forEach(cart =>{
        let idCart = cart.id;
        let cantidad = cart.quantity;

        
        let producto = arrayProds.find(prod => prod.id === idCart)
        if (producto) {
            prodActuales.push({...producto, quantity: cantidad})          
            
        }
        
    })
    return prodActuales;
}

// console.log(await productosActuales());


export default productosActuales