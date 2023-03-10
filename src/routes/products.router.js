import { Router } from "express";
import { io } from "../server.js";
import { ProductManagerMongo } from "../dao/productManagerMongo.js";
import { productModel } from "../dao/models/product.model.js";
import { uploader } from "../utils.js";

const router = Router();
const pm = new ProductManagerMongo()


router.get('/', async (req, res)=>{
    try {
        const {limit = 10} = req.query
        const {page=1} = req.query
        const sort = req.query.sort
        const query = req.query.query
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = await productModel.paginate({}, {limit: limit, page, lean: true})
        const productos = docs
        let prevLink;
        let nextLink;
        
        if (limit !== 10) {
            if (hasNextPage === false)  nextLink = null
            else nextLink = `http://localhost:3005/api/products?limit=${limit}&page=${nextPage}`
            if (hasPrevPage === false) prevLink = null
             else prevLink = `http://localhost:3005/api/products?limit=${limit}&page=${prevPage}`
            let productosLimitados = productos.slice(0, limit)
            res.send({
                status: 'succes',
                payload: productosLimitados,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            })
        } else if (query) {
            if (hasNextPage === false)  nextLink = null
            else nextLink = `http://localhost:3005/api/products?query=stock&page=${nextPage}`
            if (hasPrevPage === false) prevLink = null
             else prevLink = `http://localhost:3005/api/products?query=stock&page=${prevPage}`
            let filtrados = productos.filter(prod => prod.stock > 0)
            res.send({
                status: 'succes',
                payload: filtrados,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            })
        }else if (sort) {
            if (hasNextPage === false)  nextLink = null
            else nextLink = `http://localhost:3005/api/products?sort=${sort}&page=${nextPage}`
            if (hasPrevPage === false) prevLink = null
             else prevLink = `http://localhost:3005/api/products?sort=${sort}&page=${prevPage}`
            let ordenados = await productModel.find({}).sort({price: sort}).exec()
            res.send({
                status: 'succes',
                payload: ordenados,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            })
        } else{
            if (hasNextPage === false)  nextLink = null
            else nextLink = `http://localhost:3005/api/products?page=${nextPage}`
            if (hasPrevPage === false) prevLink = null
            else prevLink = `http://localhost:3005/api/products?page=${prevPage}`
            res.send({
                status: 'succes',
                payload: productos,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            })

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



router.post('/', uploader.single('file'),async (req, res)=>{
    try {
    let titulo = req.body.title
    let descripcion = req.body.description
    let precio = req.body.price
    let codigo = req.body.code
    let cantidad = req.body.stock
    let nombreImg = req.file.filename

    let ruta = `http://localhost:3005/images/${nombreImg}` 
    if (!req.file) {
        return res.status(400).send({status:"error",error:"La imagen no pudo ser guardada"})
    }
    if (!titulo || !descripcion || !precio || !codigo || !cantidad) {
        res.send('Error, debes completar todos los campos')
    } else{
        let prod = await pm.addProduct(titulo, descripcion, precio, ruta, codigo, cantidad)
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