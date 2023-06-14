import typeError from "../../typeError.js";

export default (err, req, res, next) =>{
    //console.log(err.cause);
    switch (err.code) {
        case typeError.INVALID_TYPES_ERROR:
            res.status(400).send({status:"error",error:`${err.message}, ${err.cause}`})
            break;
        case typeError.ROUTING_ERROR:
            res.status(600).send({status:'error', error: err})
            break;
        case typeError.DATABASE_ERROR:
            res.status(500).send({status:'error', error: err})
        default:
            // req.logger.fatal('Fatal error')
            res.send({status:"error", error:"Error desconocido " + err})
            break;
    }
}