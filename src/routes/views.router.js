import {Router} from 'express'
import { ProductManagerMongo } from '../dao/service/productManagerMongo.js'
import { administer, login, realTimeProducts, register, renderCartId, renderProducts } from '../controllers/views.controller.js'

const pm = new ProductManagerMongo()
const router = Router()

router.get('/', login)

router.get('/register', register)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', renderProducts)

router.get('/carts/:cid', renderCartId)

router.get('/administrar', administer)


export default router