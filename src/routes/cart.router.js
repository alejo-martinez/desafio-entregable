import { Router } from "express";
import fs from 'fs'
import {__dirname} from '../utils.js'

const router = Router()

let id = 0;
const modificarId = () => {
    return id ++;
}

const arrayCarritos = []

router.post('/', async(req, res)=>{
    const cart = {
        id: modificarId(),
        products: []
    }    
    arrayCarritos.push(cart)
    await fs.promises.writeFile('../cart.json', JSON.stringify(arrayCarritos, null, 2))
    res.send({status: 'ok'})
})

router.get('/:cid', async (req, res)=>{
    let cid = req.params.cid;
    const archivoCarritos = JSON.parse(await fs.promises.readFile('../cart.json', 'utf-8'))
    let carritoBuscado = archivoCarritos.find(carrito => carrito.id === parseFloat(cid))
    if (!carritoBuscado) {
        res.send('El carrito que estas buscando no existe')
    } else{
        res.send(carritoBuscado.products)
    }
})

router.post('/:cid/product/:pid', async(req, res)=>{
    let cid = req.params.cid;
    const carritosArray = JSON.parse(await fs.promises.readFile('../cart.json', 'utf-8'))
    let carritoBuscado = carritosArray.find(carrito => carrito.id === parseFloat(cid))
    
    let pid = req.params.pid;
    const arrayProductos = JSON.parse(await fs.promises.readFile('../productos.json', 'utf-8'))
    let prodBuscado = arrayProductos.find(prod => prod.id === parseFloat(pid))
    let prodDuplicado = carritoBuscado.products.find(prod => prod.id === JSON.parse(pid))

    if (prodDuplicado) {
        prodDuplicado.quantity += 1
        carritosArray.filter(cart => cart.id !== parseFloat(cid))
        carritosArray.push(carritoBuscado)
        await fs.promises.writeFile('../cart.json', JSON.stringify(carritosArray, null, 2))
        res.send({status: 'summed product'})
    } else{
        carritoBuscado.products.push({id: prodBuscado.id, quantity:1})
        carritosArray.filter(cart => cart.id !== parseFloat(cid))
        carritosArray.push(carritoBuscado)
        await fs.promises.writeFile('../cart.json', JSON.stringify(carritosArray, null, 2))
        res.send({status: 'succes'})
    }
})

export default router;