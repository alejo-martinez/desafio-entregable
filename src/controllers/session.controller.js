import config from "../config/config.js";


export let userRegistered;

export const getGithubUser = async(req, res)=>{
    req.session.user = req.user
    req.session.user.rol = 'usuario'
    res.redirect('/products')
    return userRegistered = req.user
}

export const createUser = async(req, res)=>{
    res.send({status:'succes', message:'usuario registrado'})
}

export const failRegister = async(req, res)=>{
    console.log('fallo la estrategia');
    res.send({error: 'Failed'})
}

export const userLogin = async(req, res)=>{
    try {
    const {email, password} = req.body
     if (email === config.adminEmail && password === config.adminPass) {
        let idSesion = req.sessionID
        userRegistered = {
            name: 'adminCoder',
            last_name: "",
            email: config.adminEmail,
            password: config.adminPass,
        }
        req.session.userRegistered = {
            id: idSesion,
            email: config.adminEmail,
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
}

export const failLogin = async(req, res)=>{
    console.log('fallo la estrategia');
    res.send({error: 'Failed'})
}

export const logOut = (req, res)=>{
    req.session.destroy(error =>{
        if(error) res.send({status:'error', message: 'no pudimos cerrar la sesion'})
        else res.send({status: 'succes', message: 'sesion cerrada con exito'})
    })
    userRegistered = ""
    
}