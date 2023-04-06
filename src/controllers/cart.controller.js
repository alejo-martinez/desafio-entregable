import {CartManagerMongo} from '../dao/service/cartManagerMongo.js'
import { cartModel } from "../dao/models/cart.model.js";
import { userRegistered } from './session.controller.js';
import nodemailer from 'nodemailer'
import { ticketModel } from '../dao/models/ticket.model.js';
const cm = new CartManagerMongo()

const date = new Date()
const arrayFechas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const arrayMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

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
        if (userRegistered.rol === "admin") {
            console.log('No tienes permisos para realizar esta acción');
        } else{
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

const transporte = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:'alejoomartinex11@gmail.com',
        pass:'lxhzkdgddtbrzwmn'
    }
})

const generateCode = () =>{
    let i = 0;
    let codigo = 'a'+i;
    i++;
    return codigo
}

export const endPurchase = async (req, res)=>{
    try {
        let cid = req.params.cid;
        let carrito = await cm.getCartById(cid);
        let productosAgregados = carrito.products;
        let carri = await cartModel.find({_id: cid}).populate('products.product')
        const fechaActual = new Date(date.getFullYear(),date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds())
        // console.log(fechaActual);
        // console.log(productosAgregados);
        let cartActual = carri[0].products;
        let monto = 0;
        // console.log(carri[0].products);
        cartActual.forEach(prod =>{
            // console.log(prod.product.price);
            return monto += prod.product.price;
        })
        let codigo = generateCode()
        // res.send({status:'ok', payload:monto})
        // console.log(monto);
        const ticket = await ticketModel.create({
            code: codigo,
            purchase_datetime:fechaActual,
            amount: monto,
            purchaser: userRegistered.email
        })
        await transporte.sendMail({
            from:'alejoomartinex11@gmail.com',
            to: userRegistered.email,
            subject:ticket
        })
        res.send({status:'succes'})

    } catch (error) {
        if(error) console.log('error al terminar la compra ' + error);
    }
}