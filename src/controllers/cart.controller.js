import {CartManagerMongo} from '../dao/service/cartManagerMongo.js'
import { cartModel } from "../dao/models/cart.model.js";

const cm = new CartManagerMongo()



export const getCarts = async (req, res)=>{
    try {
        let carritos = await cm.getCart()
        res.send(carritos)
    } catch (error) {
        if (error) {
            console.log('error al mostrar los carritos ' + error);
        }
    }
}

export const getCartId = async(req, res) =>{
    try {
        let cid = req.params.cid;
        let carritoBuscado = await cartModel.find({_id: cid}).populate('products.product')
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
}

export const createCart = async (req, res)=>{
    try {
        let carritoNuevo = await cm.addCart()
        res.send({status: 'ok', payload: carritoNuevo})
    } catch (error) {
        if (error) {
            console.log('error al crear el nuevo carrito ' + error);
        }
    }
}

export const updateCart = async(req,res)=>{
    try {
        let cid = req.params.cid
        let arrayActualizado = req.body
        await cartModel.updateOne({_id: cid}, {$set: {products:arrayActualizado}})
        res.send({status: 'array update!'})
        } catch (error) {
            if(error) console.log('error al actualizar el array de productos ' + error);       
        }
}

export const addProductInCart = async (req, res) =>{
    try {
        let cid = req.params.cid;
        let pid = req.params.pid
        let carritoBuscado = await cm.getCartById(cid)
        let duplicado = carritoBuscado.products.find(prod => prod.product == pid)
        
        if (!carritoBuscado) {
            res.send('Error, el carrito que estas buscando no existe')
            
        } else if(duplicado){
            let cantidadProdDuplicado = duplicado.quantity
            cantidadProdDuplicado += 1
            let arrayNuevoProds = carritoBuscado.products.filter(prod => prod.product != pid)
            arrayNuevoProds.push({product: pid, quantity: cantidadProdDuplicado})

            await cartModel.updateOne({_id: cid}, {$set: {products:arrayNuevoProds}})

            res.send({status: 'cantidad sumada'})

        } else if(!duplicado){
            let agregarProd = carritoBuscado.products;       
            agregarProd.push({product: pid, quantity: 1})
            await cartModel.updateOne({_id: cid}, {$set: {products:agregarProd}})
            res.send({status: 'succes'})
        }
    } catch (error) {
        if (error) {
            console.log('error al hacer el post del producto en el carrito ' + error);
        }
    }
}

export const updateProductInCart = async(req, res)=>{
    try {
    let {cid, pid} = req.params
    let cantidadActualizada = req.body.cantidad

    let carritoBuscado = await cm.getCartById(cid)

    let producto = carritoBuscado[0].products.find(prod => prod.id === pid)
    producto.quantity = cantidadActualizada
    let arrayActualizado = carritoBuscado[0].products.filter(prod => prod.id !== pid)
    arrayActualizado.push(producto)
    await cartModel.updateOne({_id: cid}, {$set: {products:arrayActualizado}})
    res.send({status: 'quantity updated'})
} catch (error) {
        if(error) console.log('error al actualizar la cantidad ' + error);
}
}

export const deleteCart = async(req, res)=>{
    try {
        let cid = req.params.cid
        await cartModel.updateOne({_id: cid}, {$set: {products:[]}})
        res.send({status: 'cart empty!'})
    } catch (error) {
        if(error) console.log('no se pudieron eliminar los productos del carrito ' + error);
    }
}

export const deleteProductInCart = async(req, res)=>{
    try {
        let {cid, pid} = req.params
        let carritoSeleccionado = await cm.getCartById(cid)
        let productosFiltrados = carritoSeleccionado[0].products.filter(prod => prod.id !== pid);
        
        await cartModel.updateOne({$set: {products:productosFiltrados}})
        res.send({status: 'succes'})
    } catch (error) {
        if (error) console.log('error al borrar el producto del carrito ' + error) 
    }
}