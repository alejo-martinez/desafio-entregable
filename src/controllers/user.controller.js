import { userModel } from "../dao/models/user.model.js";
import { actualDate, contarDias, diasTotales } from "../dao/service/getDate.js";
import { transporte } from "../utils.js";
import { io } from "../server.js";
const get = async(req, res)=>{
    try {
        let users = await userModel.find().lean();
        let userSimp = [];
        users.forEach(user => {
            userSimp.push({name: user.name, email: user.email, rol: user.rol});
        })
        
        return res.send({status: 'succes', payload: userSimp});
    } catch (error) {
        if(error) console.log('Error al traer los usuarios ' + error)
    }
}

const updateRol = async(req, res) =>{
    try {
        const {id, valor} = req.body;
        if(!valor) res.send({status:'error', error: 'Debes completar el campo'})
        else{
            // let users = await userModel.find().lean();
            // io.emit('usuarios', users)
            await userModel.updateOne({_id: id}, {$set: {rol: valor}})
            res.send({status:'succes'})
        }
    } catch (error) {
        if(error) console.log('Error al actualizar el rol ' + error);
    }
}

const deleteUser = async(req, res)=>{
    try {
        const {uid} = req.params;
        await userModel.deleteOne({_id: uid})
        res.send({status:'succes'});
    } catch (error) {
        if(error) console.log('Error al borrar el user '+ error);
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
        if(error) console.log('No se pudieron borrar los users inactivos ' + error);
    }
}


export default {
    get,
    deleteUserInactive,
    updateRol,
    deleteUser
}