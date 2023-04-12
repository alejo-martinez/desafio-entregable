import typeError from "../../typeError.js";

export default (error, req, res, next) =>{
    console.log(error.cause);
    switch (error.code) {
        case typeError.INVALID_TYPES_ERROR:
            res.send({status:"error",error:error.name})
            break;
    
        default:
            res.send({status:"error", error:"Error desconocido"})
            break;
    }
}