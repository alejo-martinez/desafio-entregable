import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";

const router = Router()

export let userRegistered;
router.post('/register', async(req, res)=>{
    try {
    const {name, last_name, email, password} = req.body
    if(!name || !last_name || !email || !password) res.send({status:'error', error: 'debe completar todos los datos'})

    const userExisting = await userModel.findOne({email})
    if (userExisting) {
        res.send({status: 'error', error: 'ya existe un usuario registrado con el email elegido'})
    } else{
        const usuario = await userModel.create({
            name,
            last_name,
            email,
            password
        })
        res.send({status: 'usuario creado con éxito', payload: usuario})
    }
    } catch (error) {
        if(error) console.log('error al intentar hacer el registro de usuario ' + error);
    }
})

router.post('/login', async(req, res)=>{
    try {
    const {email, password} = req.body
    if(!email || !password){
        res.send({status: 'error', error: 'debes completar todos los campos'})
    }
    else if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
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
    }
    else{
        userRegistered = await userModel.findOne({email, password}).lean()
        if (!userRegistered) {
            res.send({status:'error', error:'el email o contraseña no coinciden'})
        } else{
            req.session.userRegistered = {
                id: userRegistered._id,
                email: userRegistered.email,
            }
            userRegistered.rol = 'usuario'
            res.send({status: 'succes', message: '¡usuario logueado!'})
            return userRegistered
        }
    }
    } catch (error) {
        if(error) console.log('error al intentar iniciar sesion ' + error);
    }
})
router.delete('/login', (req, res)=>{
    req.session.destroy(error =>{
        if(error) res.send({status:'error', message: 'no pudimos cerrar la sesion'})
        else res.send({status: 'succes', message: 'sesion cerrada con exito'})
    })
    userRegistered = ""
    // res.redirect('/')
    
})
export default router