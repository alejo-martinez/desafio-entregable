import express from 'express'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import userRouter from './routes/user.router.js'
import {__dirname} from './utils.js'
import handlebars from 'express-handlebars'
import path from 'path'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from './routes/session.router.js'
import passport from 'passport'
import initPassport from './config/passport.config.js'
import config from './config/config.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errors from './errors/middlewares/errors/index.js'
import { addLogger } from './logger.js'


import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { userModel } from './dao/models/user.model.js'

const app = express()

const httpServer = app.listen(parseFloat(config.port) || 3005, ()=>{
    console.log('server iniciado');
})
export const io = new Server(httpServer)

const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info:{
            title:'Documentacion de las APIs',
            description:'APIs del e-commerce'
        }
    },
    apis:[`./docs/**.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(addLogger)

app.use(session({
    store:MongoStore.create({
        mongoUrl:config.mongoURL || "mongodb+srv://AlejoM:cluster0selacome@ecommerce.wuolt09.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:20
    }),
    secret:"secreCode",
    resave:false,
    saveUninitialized:false
}))
initPassport()

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser('CoderS3cR3tC0D3'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin:'/',methods:['GET','POST','PUT']}))
app.use('/static', express.static(__dirname +'/public'))
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(__dirname+'/public'))

app.use('/', viewsRouter)
app.use('/api/cart/', cartRouter)
app.use('/api/products/', productsRouter)
app.use('/api/session/', sessionRouter)
app.use('/api/users/', userRouter)

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

let user ;
io.on('connection', async (socket)=>{
    console.log('cliente conectado');
    socket.on('usuario', data => user = data)
    socket.emit('usersact', user)
})

mongoose.connect('mongodb+srv://AlejoM:cluster0selacome@ecommerce.wuolt09.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
app.use(errors)