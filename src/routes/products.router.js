import { Router } from "express";
import { ProductManager } from "../index.js";

const router = Router();
const pm = new ProductManager('../productos.json')


router.get('/', async (req, res)=>{
    let file = await pm.getProduct()
    let limit = req.query.limit
    if (limit) {
        res.send(file.slice(0, limit))
    } else{
        res.send(file)
    }
})

router.get('/:pid', async (req, res)=>{
    let idProd = req.params.pid
    let producto = await pm.getProductById(parseFloat(idProd))
    if (!producto) {
        res.send('El id que estas buscando no corresponde con ningún producto existente')
    } else{
        res.send(producto)
    }
})



router.post('/', (req, res)=>{
    let titulo = req.body.title
    let descripcion = req.body.description
    let precio = req.body.price
    let imagen = req.body.thumbnail
    let codigo = req.body.code
    let cantidad = req.body.stock
    if (!titulo || !descripcion || !precio || !codigo || !cantidad) {
        res.send('Error, debes completar todos los campos')
    } else{
        pm.addProduct(titulo, descripcion, precio, imagen, codigo, cantidad)
        res.send({status: 'succes'})
    }
})

router.put('/:pid', async (req, res)=>{
    let idProducto = req.params.pid
    let propiedad = req.body.campo
    let value = req.body.valor
    let arrayDeProd =  await pm.getProduct()
    if (arrayDeProd.find(prod => prod.id === parseFloat(idProducto))) {
        await pm.updateProduct(parseFloat(idProducto), propiedad, value)
        res.send({status: 'ok'})
    } else{
        res.send('El id del producto que estas buscando no fue encontrado')
    }
})

router.delete('/:pid', async (req, res)=>{
    let idP = req.params.pid;
    idP = parseFloat(idP)
    let prodArray = await pm.getProduct()
    if (prodArray.find(prod => prod.id === idP)) {
        await pm.deleteProduct(idP)
        res.send({status: 'ok'})
    } else {
        res.send('el producto que queres borrar no existe')
    }
})

export default router