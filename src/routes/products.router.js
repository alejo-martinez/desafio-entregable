import { Router } from "express";
import { io } from "../server.js";
import { ProductManagerMongo } from "../dao/productManagerMongo.js";

const router = Router();
const pm = new ProductManagerMongo()


router.get('/', async (req, res)=>{
    try {
        let limit = req.query.limit
        let productos = await pm.getProduct()
        if (limit) {
            res.send(productos.slice(0, limit))
        } else{
            res.send(productos)
        }
        
    } catch (error) {
        if (error) {
            console.log('error al leer los productos' + error);
        }
    }
})

router.get('/:pid', async (req, res)=>{
    try {
        let idProd = req.params.pid
        let producto = await pm.getProductById(idProd)
        if (!producto) {
            res.send('El id que estas buscando no corresponde con ningún producto existente')
        } else{
            res.send(producto)
        }
    } catch (error) {
        if (error) {
            console.log('error al buscar el archivo especificado' + error);
        }
    }
})



router.post('/', async (req, res)=>{
    try {
    let titulo = req.body.title
    let descripcion = req.body.description
    let precio = req.body.price
    let codigo = req.body.code
    let cantidad = req.body.stock
    if (!titulo || !descripcion || !precio || !codigo || !cantidad) {
        res.send('Error, debes completar todos los campos')
    } else{
        let prod = await pm.addProduct(titulo, descripcion, precio, codigo, cantidad)
        res.send({status: 'succes', payload: prod})
        io.emit('prodNew',  prod)
    } 
    }
    catch (error) {
        if (error) {
            console.log('error al crear el producto' + error);
        }
    } 
})




router.put('/:pid', async (req, res)=>{
    try {
        let idProducto = req.params.pid
        let propiedad = req.body.campo
        let value = req.body.valor
        let productoActualizado = await pm.updateProduct(idProducto, propiedad, value)
        res.send({status: 'succes', payload: productoActualizado})
    } catch (error) {
        if (error) {
            console.log('error al actualizar el producto' + error);
        }
    }
})

router.delete('/:pid', async (req, res)=>{
    try {
        let idP = req.params.pid;
        await pm.deleteProduct(idP)
        res.send({status: 'succes'})
    } catch (error) {
        if (error) {
            console.log('error al borrar el producto' + error);
        }
    }
})

export default router