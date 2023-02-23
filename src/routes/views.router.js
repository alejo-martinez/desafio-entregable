import { ProductManagerMongo } from '../dao/productManagerMongo.js'
import {Router} from 'express'
import { productModel } from '../dao/models/product.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import { userRegistered } from './session.router.js'

const pm = new ProductManagerMongo()
const router = Router()
// console.log(userRegistered);
router.get('/', async (req, res)=>{
    // let prodsAct = await pm.getProduct()
    res.render('login')
})

router.get('/register', async(req, res)=>{
    res.render('register')
})

router.get('/realtimeproducts', async (req, res)=>{
    let prodActuales = await pm.getProduct()
    
    res.render('realTimeProducts', {prodActuales})
})

router.get('/products', async(req, res)=>{
    const {limit = 10} = req.query
    const {page=1} = req.query
    const sort = req.query.sort
    const query = req.query.query
    const {docs} = await productModel.paginate({}, {limit: limit, page, lean: true})
    const productos = docs
    if (limit !== 10) {

        // console.log(userRegistered);
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
})

router.get('/carts/:cid', async(req, res)=>{
    let cid = req.params.cid
    let carritoBuscado = await cartModel.find({_id: cid}).lean().populate('products.product')
    let listaProds = [];
    for (let index = 0; index < carritoBuscado[0].products.length; index++) {
        listaProds.push(carritoBuscado[0].products[index].product)
    }
    
    res.render('carts', {listaProds})
})
// router.get('/chat', async(req, res)=>{
//     res.render('chat')
// })

export default router