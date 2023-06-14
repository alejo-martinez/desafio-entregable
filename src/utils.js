import {fileURLToPath} from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import config from './config/config.js';
import nodemailer from 'nodemailer'
import { faker } from '@faker-js/faker';
import { userRegistered } from './controllers/session.controller.js';
import { productRepository } from './repository/index.js';
import { userModel } from './dao/models/user.model.js';
// import { expired, obj } from './controllers/session.controller.js';

faker.locale = 'es';

const PRIVATE_KEY = 'KeyParaJWT'
// const date = new Date()

export const strategyPassport = (strategy)=>{
    return async(req, res, next) =>{
        passport.authenticate(strategy,function(err, user, info){
            if(err) next(err);
            if(!user) {
                return res.status(401).send({error: info.message?info.message:info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const generateToken = (user) =>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'})
    return token;
}

export const authToken = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({error:'Not authenticated'})
    const token= authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error) return res.status(403).send({error:'not authorized'})
        req.user=credentials.user;
        next()
    })
}


export const userPremium = async(req, res, next) =>{
    if(userRegistered.rol === 'premium'){
        console.log(req.session.user);
        return next()
    } else{
        return res.send({status:'error', error:'no tienes los permisos para esta accion'})
    }
}

// export const linkExpired = async(req, res, next) =>{
//     let timeActual =`${date.getHours()}:${date.getMinutes()}`
//     if (timeActual === obj.horaExpired) {
//         res.render('sinPermisos')
//     } else{
//         return next()
//     }
// }

export const generateCode = ()=> {
    return Math.random() * (99999 - 1) + 1;
  }

export const standarUser = async(req, res, next)=>{
    if(req.user){
        if(req.user.rol !== 'user') next()
        else res.send('No tienes los permisos')
    } else{
        res.render('sinPermisos')
    }
    // if(userRegistered.rol !== 'user') next();
    // else res.render('sinPermisos')
}

export const isAdmin = async (req, res, next) => {
    if(req.user){
        if(req.user.rol === 'admin') next()
        else res.send('No tienes los permisos')
    } else{
        res.render('sinPermisos')
    }
    // if(userRegistered.rol === 'admin') {
    //     return next();
    // } else {
    //     res.render('sinPermisos')
    // }
}

export const notAdmin = async(req, res, next) => {
    if(req.user.rol !== 'admin') {
        return next();
    } else {
        return res.status(400).send({status: 'error', error:'No tienes los permisos para realizar esta accion'})
    }
}

export const transporte = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:config.userNodemailer || 'alejoomartinex11@gmail.com',
        pass:config.passNodemailer || 'lxhzkdgddtbrzwmn'
    }
})

export const generateProducts = () =>{
    let numProductos = parseInt(faker.random.numeric(3,{bannedDigits:['0']}))
    let productos = []
    for(let i=0; i<numProductos ;i++){
        productos.push({title: faker.commerce.productName(), description: faker.commerce.productDescription(), price: faker.commerce.price(), thumbnail: faker.image.image(), code: generateCode(), stock: faker.commerce.price(1, 50, 0), status: true, _id: faker.database.mongodbObjectId()});
     }
    return productos;
}


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
 
const __filename = fileURLToPath(import.meta.url);
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,`${__dirname}/public/images`)
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage,onError:function(err,next){
    console.log(err);
    next();
}});
export const __dirname = dirname(__filename);

export const premiumProd = async(id) =>{
    let prod = await productRepository.getById(id)
    if(prod.owner !== 'admin' && prod.owner !== undefined){
        let user = await userModel.findOne({email: prod.owner})
        await transporte.sendMail({
            from:'alejoomartinex11@gmail.com',
            to:prod.owner,
            subject:'Eliminacion de producto',
            html:`<div><h1>Sr/a ${user.name}:</h1>
            <span>Su producto "${prod.title}" fue eliminado. Disculpe las molestias</span>
            </div>`
        })
    }
}