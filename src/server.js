import express from 'express'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import {__dirname} from './utils.js'
import handlebars from 'express-handlebars'
import path from 'path'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import { arrayActualizado } from './routes/products.router.js'
// import products from '../productos.json'  assert {type: "json"};
// import { ProductManager } from './index.js'

// const pm = new ProductManager('../productos.json')
const app = express()
const httpServer = app.listen(3005, ()=>{
    console.log('server iniciado');
})
export const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname +'/public'))
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(__dirname+'/public'))

app.use('/', viewsRouter)
app.use('/api/cart/', cartRouter)
app.use('/api/products/', productsRouter)

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

let array ;
io.on('connection', (socket)=>{
    console.log('cliente conectado');

    // socket.on('arrayNew', data=>{
    //     array = data
    //     // console.log(data);
    //     // data.forEach(prod =>{
    //     //     array.push(prod)
    //     // })
    // })
    // console.log(arrayActualizado);

    io.emit('array', arrayActualizado)
    
})