import {Router} from 'express'
import { ProductManagerMongo } from '../dao/service/productManagerMongo.js'
import { admUsers, administer, login, mockingproducts, realTimeProducts, register, renderCartId, renderProducts } from '../controllers/views.controller.js'
import { isAdmin, standarUser } from '../utils.js'
import passport from 'passport'

const pm = new ProductManagerMongo()
const router = Router()

router.get('/', login)

router.get('/register', register)

router.get('/realtimeproducts', realTimeProducts)

router.get('/prods', renderProducts)

router.get('/products',passport.authenticate('jwt', {failureRedirect:'/prods'}),renderProducts)

router.get('/carts/:cid', passport.authenticate('jwt'), renderCartId)

router.get('/administrar', passport.authenticate('jwt'),standarUser, administer)

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

router.get('/admusers', passport.authenticate('jwt'),isAdmin, admUsers);

// router.get('/resetpassword', enviarMail)

// router.get('/cambiopassword', linkExpired ,passwordReset)

export default router