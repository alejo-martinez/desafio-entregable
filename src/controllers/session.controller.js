import config from "../config/config.js";
import { userModel } from "../dao/models/user.model.js";
import { isValidPassword } from "../utils.js";
import { createHash, generateToken, transporte } from "../utils.js";


export let userRegistered;
const date = new Date()

export const getGithubUser = async(req, res)=>{
    req.session.user = req.user
    req.session.user.rol = 'usuario'
    const acces_token = generateToken(req.session.user)
    res.cookie('accesToken', acces_token, {maxAge:60*60*1000, signed:true, httpOnly: true}).redirect('/products')
    return userRegistered = req.user
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
            res.status(400).send({status:'error', error:'contraseña inválida'})
        } else{
            req.session.user = {
                name: req.user.name,
                last_name: req.user.last_name,
                email: req.user.email,
                rol: 'usuario'
            }
            
            const acces_token = generateToken(req.user)
            res.cookie('accesToken', acces_token, {maxAge: 60*60*1000, signed: true, httpOnly: true}).send({status:'succes', message: '¡usuario logueado!'})
            return userRegistered = req.user
            
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
        else res.clearCookie('accesToken').send({status: 'succes', message: 'sesion cerrada con exito'})
    })
    userRegistered = ""
    
}

// export let obj={};

// export const passReset = async (req, res) =>{
//     try {
//         obj.userPassReset = req.params.email
//         let user = await userModel.findOne({email: obj.userPassReset})
//         if(!user) res.status(400).send({error: 'El email no esta asociado a ningun usuario'})
//         else {
//             obj.horaExpired = `${date.getHours()+1}:${date.getMinutes()}`
//             await transporte.sendMail({
//                 from:'alejoomartinex11@gmail.com',
//                 to: obj.userPassReset,
//                 subject:'Password reset',
//                 html:'<p>Haga click en el siguiente link para cambiar su contraseña: </p> <a href="http://localhost:3005/cambiopassword">Click aqui</a>'
//             })
//             res.send({status: 'ok'})
//             return obj;
//         }
//     } catch (error) {
//         if(error) req.logger.fatal('Error al intentar resear la contraseña')
//     }
// }

// export let expired = false;

// export const updatePass = async(req, res) =>{
//     try {
//         const {password} = req.body;
//         let user = await userModel.findOne({email: obj.userPassReset})
//         if(isValidPassword(user, password)) {
//             res.send({status:'error', error: 'no puedes usar la misma clave, elija otra'})
//         }
//         else {      
//                 await userModel.updateOne({email: obj.userPassReset}, {$set: {password: createHash(password)}})
//                 res.send({status:'succes'})
//             }
        
//     } catch (error) {
//         if(error) req.logger.error('Error al actualizar la contraseña')
//     }
// }