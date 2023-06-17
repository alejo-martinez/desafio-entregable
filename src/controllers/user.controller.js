import { userModel } from "../dao/models/user.model.js";
import {contarDias, diasTotales } from "../dao/service/getDate.js";
import customError from "../errors/customError.js";
import typeError from "../errors/typeError.js";
import { transporte } from "../utils.js";

const get = async(req, res)=>{
    try {
        let users = await userModel.find().lean();
        let userSimp = [];
        users.forEach(user => {
            userSimp.push({name: user.name, email: user.email, rol: user.rol});
        })
        return res.send({status: 'succes', payload: userSimp});
    } catch (error) {
        if(error) res.status(500).send({status:'error', error: 'Error al obtener los usuarios: ' + error})
    }
}

const updateRol = async(req, res, next) =>{
    try {
        const {id, valor} = req.body;
        if(!valor) customError.createError({name:'Error al actualizar el rol', cause:`Debes ingresar un rol, se obtuvo: ${valor}`, message:'Fallo en la actualizacion del rol', code:typeError.INVALID_TYPES_ERROR})
        else{
            if(valor !== 'admin' && valor !== 'user' && valor !== 'premium') customError.createError({name:'Error al actualizar el rol', cause:`el valor "${valor}" no es válido. Debes ingresar:  "admin", "user" o "premium".`, message: 'Fallo en la actualizacion del rol',code:typeError.INVALID_TYPES_ERROR})
            else{
                await userModel.updateOne({_id: id}, {$set: {rol: valor}})
                res.send({status:'succes', message: 'usuario actualizado'})
            }
        }
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req, res)=>{
    try {
        const {uid} = req.params;
        await userModel.deleteOne({_id: uid})
        res.send({status:'succes'});
    } catch (error) {
        if(error) res.status(500).send({status:'error', error:'Error al borrar el usuario: ' + error})
    }
}

const deleteUserInactive = async(req, res)=>{
    try {
      let endpointCall = diasTotales;
      let users = await userModel.find().lean();
      users.forEach(async (user) =>{
        let diasLogin = contarDias(user.last_login)
        if(endpointCall - diasLogin >= 2){
            await transporte.sendMail({
                from:'alejoomartinex11@gmail.com',
                to: user.email,
                subject: 'Eliminacion de su cuenta',
                html:`<div>
                <h1>Querido ${user.name}:</h1>
                <span>Su cuenta ha permanecido mas de 2 días sin actividad, por lo que nuestra plataforma la ha borrado. No se preocupe, puede crear otra cuenta gratuita. Disculpe las molestias !</span>
                </div>`
            })
            await userModel.deleteOne({_id: user._id})
        }
    })  
        return res.send({status: 'succes', payload: 'Usuarios inactivos eliminados'});
    } catch (error) {
        if(error) res.status(500).send({status:'error', error:'Error al borrar los usuarios inactivos: ' + error})
    }
}


export default {
    get,
    deleteUserInactive,
    updateRol,
    deleteUser
}