import express from 'express'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import {__dirname} from './utils.js'
import handlebars from 'express-handlebars'
import path from 'path'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'



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

let mensajes = []
io.on('connection', async (socket)=>{
    console.log('cliente conectado');
    socket.on('mensaje', data =>{
        mensajes.push(data)
        io.emit('mensajesNuevos', mensajes)
    })
})

mongoose.connect('mongodb+srv://AlejoM:cluster0selacome@ecommerce.wuolt09.mongodb.net/?retryWrites=true&w=majority', error =>{
    if (error) {
        console.log('no se pudo realizar la conexion');
        process.exit()
    }
})