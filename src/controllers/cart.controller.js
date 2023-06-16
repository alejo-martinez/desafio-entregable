import {CartManagerMongo} from '../dao/service/cartManagerMongo.js'
import { userRegistered } from './session.controller.js';
import { cartRepository, productRepository, ticketRepository } from '../repository/index.js';
import { transporte, generateCode } from '../utils.js';
import { userModel } from '../dao/models/user.model.js';

const cm = new CartManagerMongo()


const date = new Date()
const arrayFechas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const arrayMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export const getCarts = async (req, res, next)=>{
    try {
        let carritos = await cartRepository.get()
        res.send(carritos)
    } catch (error) {
        if (error) {
            next(error);
            req.logger.error('error al mostrar los carritos ' + error);
        }
    }
}

export const getCartId = async(req, res, next) =>{
    try {
        let cid = req.params.cid;
        let carritoBuscado = await cartRepository.getById(cid)
        res.send(carritoBuscado)
    } catch (error) {
        if (error) {
            next(error)
            // req.logger.error('error al buscar el carrito solicitado ' + error);
            // res.status(500).send({status:'error', error:'Error al traer el producto ' + error})
        }
    }
}

export const createCart = async (req, res)=>{
    try {
        let carritoNuevo = await cartRepository.createCart()
        const {email} = req.body;
        await userModel.updateOne({email: email}, {$set:{carrito:carritoNuevo}})
        res.send({status: 'succes', payload: carritoNuevo})
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
        await cartRepository.updateProductsId(cid, arrayActualizado)

        res.send({status: 'succes'})
        } catch (error) {
            if(error) req.logger.error('error al actualizar el array de productos ' + error);       
        }
}

export const addProductInCart = async (req, res) =>{
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let carritoBuscado = await cartRepository.getById(cid);
        let duplicado;
        let producto = await productRepository.getById(pid)
        if (!carritoBuscado) req.logger.fatal('Error, el carrito que estas buscando no existe');
        else {
            if(producto.stock === 0) res.send({status: 'error', payload: 'No hay stock'})
            else{
                duplicado = carritoBuscado.products.find(prod => prod.product == pid)
                if(duplicado){
                    let cantidadProdDuplicado = duplicado.quantity
                    cantidadProdDuplicado += 1
                    let arrayNuevoProds = carritoBuscado.products.filter(prod => prod.product != pid)
                    arrayNuevoProds.push({product: pid, quantity: cantidadProdDuplicado})
                    await cartRepository.updateProductsId(cid, arrayNuevoProds)
                    res.send({status: 'succes', message: 'cantidad sumada!'})
                } else{
                    let agregarProd = carritoBuscado.products;      
                    agregarProd.push({product: pid, quantity: 1})
                    await cartRepository.updateProductsId(cid, agregarProd)
                    res.send({status: 'succes', message: 'producto agregado'})
                }
            }
        }
    } catch (error) {
        if (error) {
            req.logger.error('error al hacer el post del producto en el carrito ' + error);
        }
    }
}

export const updateProductInCart = async(req, res)=>{
    try {
    let {cid, pid} = req.params
    let cantidadActualizada = req.body.cantidad

    let carritoBuscado = await cartRepository.getById(cid)

    let producto = carritoBuscado[0].products.find(prod => prod.id === pid)
    producto.quantity = cantidadActualizada
    let arrayActualizado = carritoBuscado[0].products.filter(prod => prod.id !== pid)
    arrayActualizado.push(producto)
    await cartRepository.updateProductsId(cid, arrayActualizado)

    res.send({status: 'quantity updated'})
} catch (error) {
        if(error) req.logger.error('error al actualizar la cantidad ' + error);
}
}

export const deleteCart = async(req, res)=>{
    try {
        let cid = req.params.cid
        await cartRepository.updateProductsId(cid, [])

        res.send({status: 'cart empty!'})
    } catch (error) {
        if(error) req.logger.error('no se pudieron eliminar los productos del carrito ' + error);
    }
}

export const deleteProductInCart = async(req, res)=>{
    try {
        let {cid, pid} = req.params
        let carritoSeleccionado = await cartRepository.getById(cid)
        let productosFiltrados = carritoSeleccionado[0].products.filter(prod => prod.id !== pid);
        
        await cartRepository.updateProductsId(cid, productosFiltrados)

        res.send({status: 'succes'})
    } catch (error) {
        if (error) req.logger.error('error al borrar el producto del carrito ' + error) 
    }
}



export const endPurchase = async (req, res)=>{
    try {
        let cid = req.params.cid;
        let cart = await cartRepository.getPopulate(cid)
        let prodValidos = [];
        let prodInvalidos = [];
        cart[0].products.forEach(async (prod) =>{
            if (prod.product.stock >= prod.quantity) {
                prodValidos.push(prod)
                let stockAct = prod.product.stock - prod.quantity;
                await productRepository.updateProduct(prod.product._id, 'stock' ,stockAct)
            } else {
                prodInvalidos.push(prod)
                return prodInvalidos;
            }
        })
        await cartRepository.updateProductsId(cid, prodInvalidos)
        if (prodValidos.length !== 0) {
            const fechaActual = `día ${arrayFechas[date.getDay()]} ${date.getDate()} de ${arrayMeses[date.getMonth()]} de ${date.getFullYear()} a las ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            let monto = 0;
            prodValidos.forEach(prod =>{
                return monto += prod.product.price * prod.quantity;
            })
            const ticket = await ticketRepository.createTicket(generateCode(), fechaActual, monto, userRegistered.email)
            await transporte.sendMail({
                from:'alejoomartinex11@gmail.com',
                to: userRegistered.email,
                subject: 'Comprobante de compra',
                html:`<div>
                <h1>Gracias ${ticket.purchaser} por comprar en nuestra tienda!</h1>
                <span>Su compra por $${ticket.amount}, se efectuo el ${ticket.purchase_datetime}. Su código es ${ticket.code}</span>
                </div>`
            })
            prodValidos = []
            res.send({status:'succes'})
        }

    } catch (error) {
        if(error) req.logger.error('error al terminar la compra ' + error);
    }
}