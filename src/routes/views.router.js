import {productosActuales} from '../index.js'
import {Router} from 'express'
// import { io } from '../server.js'
// import { arrayActualizado } from './products.router.js'


const router = Router()

router.get('/', async (req, res)=>{
    let prodsAct = await productosActuales()
    res.render('home', {prodsAct})
})

router.get('/realtimeproducts', async (req, res)=>{
    let prodActuales = await productosActuales()
    
    res.render('realTimeProducts', {prodActuales})
})

export default router