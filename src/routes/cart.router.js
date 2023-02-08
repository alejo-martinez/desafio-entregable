import { Router } from "express";
import {__dirname} from '../utils.js'
import { CartManagerMongo } from "../dao/cartManagerMongo.js";
import { ProductManagerMongo } from "../dao/productManagerMongo.js";
import { cartModel } from "../dao/models/cart.model.js";


const router = Router()
const cm = new CartManagerMongo()
const pm = new ProductManagerMongo()

router.post('/', async(req, res)=>{
    try {
        let carritoNuevo = await cm.addCart()
        res.send({status: 'ok', payload: carritoNuevo})
    } catch (error) {
        if (error) {
            console.log('error al crear el nuevo carrito ' + error);
        }
    }
})

router.get('/:cid', async (req, res)=>{
    try {
        let cid = req.params.cid;
        let carritoBuscado = await cm.getCartById(cid)
        if (!carritoBuscado) {
            res.send('El carrito que estas buscando no existe')
        } else{
            res.send(carritoBuscado)
        }
    } catch (error) {
        if (error) {
            console.log('error al buscar el carrito solicitado ' + error);
        }
    }
})

router.post('/:cid/product/:pid', async(req, res)=>{
    try {
        let cid = req.params.cid;
        let pid = req.params.pid
        let carritoBuscado = await cm.getCartById(cid)
        let duplicado = carritoBuscado[0].products.find(prod => prod.id === pid)

        if (!carritoBuscado) {
            res.send('Error, el carrito que estas buscando no existe')
        } else if(!duplicado){
            await cartModel.updateOne({_id: cid}, {$set: {products: [{id: pid, quantity: 1}]}})
            res.send({status: 'succes'})
        } else{
            let cantidadProd = carritoBuscado[0].products[0].quantity
            await cartModel.updateOne({_id: cid}, {$set: {products: [{id: pid, quantity: cantidadProd + 1}]}})
            res.send({status: 'cantidad sumada'})
        }
    } catch (error) {
        if (error) {
            console.log('error al hacer el post del producto en el carrito ' + error);
        }
    }
})

router.get('/', async (req, res) =>{
    try {
        let carritos = await cm.getCart()
        res.send(carritos)
    } catch (error) {
        if (error) {
            console.log('error al mostrar los carritos ' + error);
        }
    }
})

export default router;