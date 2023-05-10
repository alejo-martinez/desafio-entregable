import {Router} from 'express'
import { ProductManagerMongo } from '../dao/service/productManagerMongo.js'
import { administer, login, mockingproducts, realTimeProducts, register, renderCartId, renderProducts } from '../controllers/views.controller.js'
import { isAdmin } from '../utils.js'

const pm = new ProductManagerMongo()
const router = Router()

router.get('/', login)

router.get('/register', register)

router.get('/realtimeproducts', realTimeProducts)

router.get('/products', renderProducts)

router.get('/carts/:cid', renderCartId)

router.get('/administrar', isAdmin, administer)

router.get('/mockingproducts', mockingproducts)

router.get('/loggerTest', (req, res)=>{
    req.logger.debug('debug')
    req.logger.http('http')
    req.logger.info('info')
    req.logger.warning('warning')
    req.logger.error('error')
    req.logger.fatal('fatal')
    res.send({status: 'succes', message: 'probando logger'})
})

// router.get('/resetpassword', enviarMail)

// router.get('/cambiopassword', linkExpired ,passwordReset)

export default router