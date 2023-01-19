import { Router } from "express";
import fs from 'fs'
import {__dirname} from '../utils.js'
import { CartManager, ProductManager } from "../index.js";

const router = Router()
const cm = new CartManager('../cart.json')
const pm = new ProductManager('../productos.json')

// let id = 0;
// const modificarId = () => {
//     return id ++;
// }

// const arrayCarritos = []

router.post('/', async(req, res)=>{
    await cm.addCart()
    res.send({status: 'ok'})
})

router.get('/:cid', async (req, res)=>{
    let cid = req.params.cid;
    let carritoBuscado = await cm.getCartById(cid)
    if (!carritoBuscado) {
        res.send('El carrito que estas buscando no existe')
    } else{
        res.send(carritoBuscado.products)
    }
})

router.post('/:cid/product/:pid', async(req, res)=>{
    let cid = req.params.cid;
    let carritoBuscado = await cm.getCartById(cid)
    if (!carritoBuscado) {
        res.send('Error, el carrito que estas buscando no existe')
    } else {
        const carritosArray = await cm.getCarts()
        let pid = req.params.pid;
        const arrayProductos = await pm.getProduct()
        let prodBuscado = arrayProductos.find(prod => prod.id === parseFloat(pid))

        let prodDuplicado = carritoBuscado.products.find(prod => prod.id === parseFloat(prodBuscado.id))
        
        if (prodDuplicado) {
            prodDuplicado.quantity += 1
            let cartArray = carritosArray.filter(cart => cart.id !== parseFloat(cid))
            cartArray.push(carritoBuscado)
            await fs.promises.writeFile('../cart.json', JSON.stringify(cartArray, null, 2))
            res.send({status: 'summed product'})
        } else{
            carritoBuscado.products.push({id: prodBuscado.id, quantity:1})
            let nuevoCartArray = carritosArray.filter(cart => cart.id !== parseFloat(cid))
            nuevoCartArray.push(carritoBuscado)
            await fs.promises.writeFile('../cart.json', JSON.stringify(nuevoCartArray, null, 2))
            res.send({status: 'succes'})
        }
    }

})

export default router;