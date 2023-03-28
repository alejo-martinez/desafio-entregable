import { ProductManagerMongo } from '../dao/service/productManagerMongo.js'
import { productModel } from '../dao/models/product.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import { userRegistered } from './session.controller.js'

const pm = new ProductManagerMongo()


export const login = async (req, res)=>{
    res.render('login')
}

export const register = async(req, res)=>{
    res.render('register')
}

export const realTimeProducts = async (req, res)=>{
    let prodActuales = await pm.getProduct()
    
    res.render('realTimeProducts', {prodActuales})
}

export const renderProducts = async(req, res)=>{
    const {limit = 10} = req.query
    const {page=1} = req.query
    const sort = req.query.sort
    const query = req.query.query
    const {docs} = await productModel.paginate({}, {limit: limit, page, lean: true})
    const productos = docs
    if (limit !== 10) {

        let prods = productos.slice(0, limit)
        res.render('productos',{prods, userRegistered})
    } else if (query) {

        let prods = productos.filter(prod => prod.stock > 0)
        res.render('productos', {prods, userRegistered})
    }else if (sort) {
        let prods = await productModel.find({}).sort({price: sort}).exec()
        res.render('productos', {prods, userRegistered})
    } else{
        let prods = productos
        res.render('productos', {prods, userRegistered})
    }
}

export const renderCartId = async(req, res)=>{
    let cid = req.params.cid
    let carritoBuscado = await cartModel.find({_id: cid}).lean().populate('products.product')
    let listaProds = [];
    for (let index = 0; index < carritoBuscado[0].products.length; index++) {
        listaProds.push(carritoBuscado[0].products[index].product)
    }
    
    res.render('carts', {listaProds})
}

export const administer = async(req, res)=>{
    res.render('administrar')
}