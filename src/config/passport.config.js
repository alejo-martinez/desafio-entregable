import passport from "passport";
import local from 'passport-local'
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import githubService from 'passport-github2'
import UserDTO from "../dao/DTOs/user.dto.js";
import jwt from 'passport-jwt'
import { actualDate } from "../dao/service/getDate.js";
import { cartRepository } from "../repository/index.js";

const JWTstrategy = jwt.Strategy;
const localStrategy = local.Strategy;

const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req =>{
    let token = null;
    if(req && req.signedCookies){
        token = req.signedCookies['accesToken']
    }
    return token;
}
const initPassport = ()=>{
    passport.use('jwt', new JWTstrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:'KeyParaJWT'
    }, async (jwt_payload, done)=>{
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error);
        }
    }))
    

    passport.use('register', new localStrategy(
        {passReqToCallback:true, usernameField:'email'}, async(req, username, passport, done) =>{
            const {name, last_name, email, password} = req.body;
            try {
                let user = await userModel.findOne({email: username})
                if (user) {
                    console.log('usuario ya existe ');
                    return done(null, false, {message:'El usuario ya existe'}) 
                } else{
                    const result = new UserDTO({name, last_name, email, password})
                    let newUser = await userModel.create(result)
                    return done(null, newUser)
                }
            } catch (error) {
                return done('Error al obtener el usuario '+ error)
            }
        }
        ))
            passport.serializeUser((user, done) =>{
            done(null, user._id)
            })
    
            passport.deserializeUser(async(id, done) =>{
            let usuario = await userModel.findOne({_id: id})
            done(null, usuario)
            })
            passport.use('login', new localStrategy(
                {passReqToCallback:true, usernameField:'email'}, async(req, username, passport, done) =>{
                    try {
                        const password = req.body.password

                        const user = await userModel.findOne({email: username}).lean()
                        if(!user){
                            return done(null, false, {message: 'El usuario no existe'})
                        } if (!password) {
                            return done(null, false,{message:'Debe ingresar una contraseña'})
                        }
                        if (!isValidPassword(user,password)) {
                            return done(null, false, {message:'contraseña invalida'})
                        } else {
                            await userModel.updateOne({email: username}, {$set: {last_login: actualDate}})
                            return done(null, user) 
                        }
                    } catch (error) {
                        return done('error al obtener el usuario ' + error)
                    }
                }
                ))


    passport.use('github', new githubService({
        clientID: "Iv1.07ddc11b0a0fb2c6",
        clientSecret: "6191a91e47a2abb4d81bfcb376e98ec02256b616",
        callbackURL: "https://desafio-entregable-production.up.railway.app/api/session",
    }, async(accesToken, refreshToken, profile, done)=>{
        try {
            let user = await userModel.findOne({email: profile._json.email}).lean()
            if(!user){
                let newUser = {
                    name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    carrito: await cartRepository.createCart()
                }
                let result = await userModel.create(newUser)
                done(null, result)
            } else{
                await userModel.updateOne({email: profile._json.email}, {$set: {last_login: actualDate}})
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done)=>{
        // let user =  await userModel.findOne({_id: id}) || 
        let user = await githubService.findById(id);
        done(null, user)
    })
}

export default initPassport;