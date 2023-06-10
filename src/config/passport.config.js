import passport from "passport";
import local from 'passport-local'
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import githubService from 'passport-github2'
import UserDTO from "../dao/DTOs/user.dto.js";
import jwt from 'passport-jwt'
import { actualDate } from "../dao/service/getDate.js";

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
            // console.log(jwt_payload);
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
                    return done(null, false) 
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
                // console.log(user);
            done(null, user)
            })
    
            passport.deserializeUser(async(user, done) =>{
            let usuario = await userModel.findOne({email: user.email})
            // console.log(usuario);
            done(null, usuario)
            })
            passport.use('login', new localStrategy(
                {passReqToCallback:true, usernameField:'email'}, async(req, username, passport, done) =>{
                    // try {
                        const password = req.body.password
                        const user = await userModel.findOne({email: username}).lean()
                        if(!user){
                            console.log('el usuario no existe');
                            req.session.message = 'El usuario no existe'
                            return done(null, false, {message: 'El usuario no existe'})
                        } if (!password) {
                            console.log('Debe ingresar una contraseña');
                            req.session.message = 'Debe ingresar una contraseña'
                            return done(null, false,{message:'Debe ingresar una contraseña'})
                        }
                        if (!isValidPassword(user,password)) {
                            console.log('contra invalida');
                            req.session.message = 'contra invalida'
                            return done(null, false, {message:'Contraseña incorrecta'})
                        } else {
                            try {
                                await userModel.updateOne({email: username}, {$set: {last_login: actualDate}})
                                return done(null, user)
                                
                            } catch (error) {
                                return done('Error al obtener el usuario ' + error)
                            }
                        }
                    // } catch (error) {
                    //     return done('error al obtener el usuario ' + error)
                    // }
                }
                ))


    passport.use('github', new githubService({
        clientID: "Iv1.07ddc11b0a0fb2c6",
        clientSecret: "6191a91e47a2abb4d81bfcb376e98ec02256b616",
        callbackURL: "http://localhost:3005/api/session",
    }, async(accesToken, refreshToken, profile, done)=>{
        try {
            let user = await userModel.findOne({email: profile._json.email}).lean()
            if(!user){
                let newUser = {
                    name: profile._json.name,
                    last_name: "",
                    email: profile._json.email
                }
                let result = await userModel.create(newUser)
                done(null, result)
            } else{
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
        // let user = await githubService.findById(id)
        let user = await userModel.findOne({_id: id})
        console.log(user);
        done(null, user)
    })
}

export default initPassport;