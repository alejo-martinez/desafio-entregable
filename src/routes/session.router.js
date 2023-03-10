import { Router } from "express";
import passport from "passport";
// import { userModel } from "../dao/models/user.model.js";
// import { createHash } from "../utils.js";
// import { isValidPassword } from "../utils.js";

const router = Router()

export let userRegistered;

router.get('/github', passport.authenticate('github',{scope:['user:email']}, async(req,res)=>{

}))

router.get('/', passport.authenticate('github', {failureRedirect:'/login'}), async(req, res)=>{
    req.session.user = req.user
    req.session.user.rol = 'usuario'
    res.redirect('/products')
    return userRegistered = req.user
})

router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}), async(req, res)=>{
    res.send({status:'succes', message:'usuario registrado'})
})

router.get('/failregister', async(req, res)=>{
    console.log('fallo la estrategia');
    res.send({error: 'Failed'})
})


router.post('/login',passport.authenticate('login', {failureRedirect:'/faillogin'}), async(req, res)=>{
    try {
    const {email, password} = req.body
     if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        let idSesion = req.sessionID
        userRegistered = {
            name: 'adminCoder',
            last_name: "",
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
        }
        req.session.userRegistered = {
            id: idSesion,
            email: 'adminCoder@coder.com',
        }
        userRegistered.rol = 'admin'
        res.send({status: 'succes'})
        return userRegistered
    }
    else{
        if (!req.user) {
            res.status(400).send({status:'error', error:'contraseña inválida'})
        } else{
            req.session.user = {
                name: req.user.name,
                last_name: req.user.last_name,
                email: req.user.email,
            }
            req.user.rol = 'usuario'
            res.send({status: 'succes', message: '¡usuario logueado!'})
            return userRegistered = req.user
            
        }
    }
    } catch (error) {
        if(error) console.log('error al intentar iniciar sesion ' + error);
    }
})

router.get('/faillogin', async(req, res)=>{
    console.log('fallo la estrategia');
    res.send({error: 'Failed'})
})
router.delete('/login', (req, res)=>{
    req.session.destroy(error =>{
        if(error) res.send({status:'error', message: 'no pudimos cerrar la sesion'})
        else res.send({status: 'succes', message: 'sesion cerrada con exito'})
    })
    userRegistered = ""
    
})
export default router