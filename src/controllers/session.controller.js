import config from "../config/config.js";
import { generateToken } from "../utils.js";


export let userRegistered;
const date = new Date()

export const getGithubUser = async(req, res)=>{
    console.log(req.user);
    req.session.user = req.user
    const acces_token = generateToken(req.session.user)
    res.cookie('accesToken', acces_token, {maxAge:7200000, signed:true, httpOnly: true}).redirect('/products')
}

export const createUser = async(req, res)=>{
    res.send({status:'succes', message:'usuario registrado'})
}

export const failRegister = async(req, res)=>{
    req.logger.fatal('fallo la estrategia');
    res.send({error: 'Failed'})
}

export const userLogin = async(req, res)=>{
    try {
    const {email, password} = req.body;
     if (email === config.adminEmail && password === config.adminPass) {
        let idSesion = req.sessionID
        userRegistered = {
            name: 'adminCoder',
            last_name: "",
            email: config.adminEmail,
            password: config.adminPass,
            rol: 'admin'
        }
        req.session.user = {
            id: idSesion,
            email: config.adminEmail,
            rol: 'admin'
        }
        const acces_token = generateToken(userRegistered)
        res.cookie('accesToken', acces_token, {maxAge: 60*60*1000, signed: true, httpOnly: true}).send({status:'succes', payload: acces_token})
        return userRegistered
    }
    else{
        if (!req.user) {
            res.status(400).send({status:'error', error:'error nqv'})
        } else{
            userRegistered = {
                id: req.user._id,
                name: req.user.name,
                last_name: req.user.last_name,
                email: req.user.email,
                rol: req.user.rol
            }
            req.session.user = {
                id: req.user._id,
                name: req.user.name,
                last_name: req.user.last_name,
                email: req.user.email,
                rol: req.user.rol
            }
            
            const acces_token = generateToken(req.user)
            res.cookie('accesToken', acces_token, {maxAge: 60*60*1000, signed: true, httpOnly: true}).send({status:'succes', message: '¡usuario logueado!'})
        }
    }
    } catch (error) {
        if(error) req.logger.error('error al intentar iniciar sesion ' + error);
    }
}

export const failLogin = async(req, res)=>{
    req.logger.fatal('fallo la estrategia');
    res.send({error: 'Failed'})
}

export const logOut = async (req, res)=>{
    req.session.destroy(error =>{
        if(error) {
            req.logger.error('Error al cerrar la sesion')
            res.send({status:'error', message: 'no pudimos cerrar la sesion'})
        }
        else{
         res.clearCookie('accesToken').send({status: 'succes', message: 'sesion cerrada con exito'})
         userRegistered = ""
        }})
}

export const current = async(req, res)=>{
    userRegistered = req.user
    res.send({status:'succes', payload:req.user});
}