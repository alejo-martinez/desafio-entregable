import { ProductManagerMongo } from '../dao/productManagerMongo.js'
import {Router} from 'express'

const pm = new ProductManagerMongo()
const router = Router()

router.get('/', async (req, res)=>{
    let prodsAct = await pm.getProduct()
    res.render('home', {prodsAct})
})

router.get('/realtimeproducts', async (req, res)=>{
    let prodActuales = await pm.getProduct()
    
    res.render('realTimeProducts', {prodActuales})
})

router.get('/chat', async(req, res)=>{
    res.render('chat')
})

export default router