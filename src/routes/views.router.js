import productosActuales from '../funciones.js'
import {Router} from 'express'


const router = Router()

router.get('/', async (req, res)=>{
    let prodsAct = await productosActuales()
    res.render('home', {prodsAct})
} )