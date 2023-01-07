import express from 'express'
import {ProductManager} from './index.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.listen(3005, ()=>{
    console.log('server iniciado');
})

const pm = new ProductManager('../productos.json')

app.get('/', (req, res)=>{
    res.send('pagina principal del server express')
})

app.get('/products',  async (req, res)=>{
    const file = await pm.getProduct()
    let limit = req.query.limit
    if (limit) {
        res.send(file.slice(0, limit))
    } else{
        res.send(file)
    }
})

app.get('/products/:idProd', async (req, res)=>{
    let idProd = req.params.idProd
    // idProd = parseFloat(idProd)
    const arrayProductos = await pm.getProduct()
    let productoBuscado = arrayProductos.find(prod => prod.id == idProd)
    
    if (!productoBuscado) {
        res.send('El id que estas buscando no corresponde con ningún producto existente')
    } else{
        res.send(productoBuscado)
    }
})