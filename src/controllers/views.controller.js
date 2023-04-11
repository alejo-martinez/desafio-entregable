import { ProductManagerMongo } from '../dao/service/productManagerMongo.js'
import { productModel } from '../dao/models/product.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import { userRegistered } from './session.controller.js'
import { CartManagerMongo } from '../dao/service/cartManagerMongo.js'
import { cartRepository } from '../repository/index.js'

const pm = new ProductManagerMongo();
const cm = new CartManagerMongo();

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
    let carrito = await cm.getCart();
    let idCart = carrito[0]._id;
    let carritoBuscado = await cm.getCartById(idCart);
    let prodEnCart = carritoBuscado.products
    let admin ;
    if (userRegistered.rol === 'admin') {
        return admin = 'admin'
    }
    if (limit !== 10) {

        let prods = productos.slice(0, limit)
        res.render('productos',{prods, userRegistered, idCart, admin})
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
    let carritoBuscado = await cartRepository.getPopulate(cid)
    let carritoDeProds = carritoBuscado[0].products;
    carritoDeProds.forEach(prod => {
        prod.product.price *= prod.quantity;
        prod.product.cartId = cid;
    })
    res.render('carts', {carritoDeProds})
}

export const administer = async(req, res)=>{
        res.render('administrar')
}