import express from 'express'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import {__dirname} from './utils.js'
import handlebars from 'express-handlebars'
import path from 'path'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use('/static', express.static(__dirname +'/public'))

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname+'views')
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'views')))

app.listen(3005, ()=>{
    console.log('server iniciado');
})

app.use('/api/products/', productsRouter)
app.use('/api/cart/', cartRouter)
