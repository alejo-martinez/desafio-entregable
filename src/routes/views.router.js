import {productosActuales} from '../index.js'
import {Router} from 'express'



const router = Router()

router.get('/', async (req, res)=>{
    let prodsAct = await productosActuales()
    res.render('home', {prodsAct})
})

router.get('/realtimeproducts', async(req, res)=>{
    let prodActuales = await productosActuales()
    res.render('realTimeProducts', {prodActuales})
})

export default router