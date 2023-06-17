import { io } from "../server.js";
import { ProductManagerMongo } from "../dao/service/productManagerMongo.js";
import { productModel } from "../dao/models/product.model.js";
import { productRepository } from "../repository/index.js";
import ProductDTO from "../dao/DTOs/product.dto.js";
import customError from "../errors/customError.js";
import { generateInvalidIdError, generateInvalidSearchError, generateProductError, generateUpdateProductError } from "../errors/infoError.js";
import typeError from "../errors/typeError.js";

const pm = new ProductManagerMongo()

export const getProducts = async (req, res)=>{
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
            req.logger.error('error al leer los productos' + error);
        }
    }
}

export const getProductId = async (req, res, next)=>{
    try {
    let idProd = req.params.pid
    if(idProd.length !== 24) {
        customError.createError({name:'Error en la búsqueda del producto', cause: generateInvalidIdError(idProd), message: 'Id inválido', code: typeError.INVALID_TYPES_ERROR})
    } else{
        let producto = await pm.getProductById(idProd);
        if (!producto) {
            customError.createError({
                    name:'Error en la busqueda del producto',
                    cause: generateInvalidSearchError('producto', idProd),
                    message: 'Falló la búsqueda del producto',
                    code: typeError.INVALID_TYPES_ERROR
                })
            } else{
                res.send(producto)
            }
        }
    } catch (error) {
            next(error);
            req.logger.error('error al buscar el producto especificado' + error);
    }
}


export const createProduct = async (req, res, next)=>{
    try {
    let titulo = req.body.title
    let descripcion = req.body.description
    let precio = req.body.price
    let codigo = req.body.code
    let cantidad = req.body.stock
    let owner;
    if(req.user.rol === 'premium') owner = req.user.email
    else owner = 'admin'
    let ruta = req.file? `http://localhost:3005/images/${req.file.filename}`: '';
    console.log(ruta);
    if (!titulo || !descripcion || !precio || !codigo || !cantidad || !req.file) {
        customError.createError({
            name: 'Error en la creación del producto',
            cause: generateProductError({titulo, descripcion, precio, codigo, cantidad, ruta}),
            message: 'Fallo en la creación del producto',
            code: typeError.INVALID_TYPES_ERROR
        })
    } else{
        let producto = new ProductDTO(titulo, descripcion, precio, ruta, codigo, cantidad, owner)
        let prod = await productRepository.createProduct(producto)
        io.emit('prodNew',  prod)
        res.send({status: 'succes', payload: producto});
    } 
} catch (error) {
    req.logger.error(error);
    next(error)
    } 
}

export const updateProductById = async (req, res, next)=>{
    try {
        let idProducto = req.params.pid
        let propiedad = req.body.campo
        let value = req.body.valor
        if(!propiedad || !value) customError.createError({name:'Fallo en la actualización del producto', cause: generateUpdateProductError(propiedad, value), message:'Faltan valores', code:typeError.INVALID_TYPES_ERROR});
        else {
            await productRepository.updateProduct(idProducto, propiedad, value)
            res.send({status: 'succes'})
        }
    } catch (error) {
        if (error) {
            req.logger.error('error al actualizar el producto' + error);
            next(error)
        }
    }
}

export const deleteProductById = async (req, res)=>{
    try {
        let idP = req.params.pid;
        await productRepository.deleteProduct(idP);
        res.send({status: 'succes'})  
    } catch (error) {
        if (error) {
            req.logger.error('error al borrar el producto' + error);
        }
    }
}