import express from 'express'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import {__dirname} from './utils.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))


app.listen(3005, ()=>{
    console.log('server iniciado');
})

app.use('/api/products/', productsRouter)
app.use('/api/cart/', cartRouter)
