import { ProductManagerMongo } from '../dao/service/productManagerMongo.js'
import { productModel } from '../dao/models/product.model.js'
import { CartManagerMongo } from '../dao/service/cartManagerMongo.js'
import { cartRepository } from '../repository/index.js'
import { generateProducts } from '../utils.js'
import { userModel } from '../dao/models/user.model.js'

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
    let userRegistered;
    let admin;
    let premium;
    let standard
    if(req.user){
        userRegistered = req.user
        admin = req.user.rol === 'admin'? req.user.rol : '';
        premium = req.user.rol === 'premium'? req.user.rol : '';
        standard = req.user.rol === 'user'? req.user.rol : '';
    }
    let sinUser = !req.user? 'sinuser':'';
    const {limit = 10} = req.query;
    const {page=1} = req.query;
    const sort = req.query.sort;
    const query = req.query.query;
    const {docs} = await productModel.paginate({}, {limit: limit, page, lean: true});
    const productos = docs;
    if (limit !== 10) {
        let prods = productos.slice(0, limit)
        res.render('productos',{prods, userRegistered, admin, premium, standard, sinUser})
    } else if (query) {
        let prods = productos.filter(prod => prod.stock > 0)
        res.render('productos', {prods, userRegistered, admin, premium, standard, sinUser})
    }else if (sort) {
        let prods = await productModel.find({}).sort({price: sort}).exec()
        res.render('productos', {prods, userRegistered, admin, premium, standard, sinUser})
    } else{
        let prods = productos
        res.render('productos', {prods, userRegistered, admin, premium, standard, sinUser})
    }
}


export const renderCartId = async(req, res)=>{
    let user = req.user
    let cid = req.params.cid
    let carritoBuscado = await cartRepository.getPopulate(cid)
    let carritoDeProds = carritoBuscado[0].products;
    if(carritoDeProds.length === 0){
        res.render('cartvacio', {user})
    } else{
        carritoDeProds.forEach(prod => {
            prod.product.price *= prod.quantity;
            prod.product.cartId = cid;
        })
        res.render('carts', {carritoDeProds, user})
    }
}

export const administer = async(req, res)=>{
    let userlogued = req.user;
    res.render('administrar', {userlogued});
}

export const mockingproducts = async(req, res)=>{
    let productos = generateProducts()
    res.render('mockingproducts', {productos})
}

export const enviarMail = async(req, res) =>{
    res.render('enviarmail')
}

export const passwordReset = async (req, res) =>{
        res.render('cambiopass')
}


export const admUsers = async(req, res) =>{
    let users = await userModel.find().lean();
    let userRegistered = req.user;
    res.render('administrarUsers', {users, userRegistered})
    
}