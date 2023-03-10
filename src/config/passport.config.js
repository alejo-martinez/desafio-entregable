import passport from "passport";
import local from 'passport-local'
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import githubService from 'passport-github2'

const localStrategy = local.Strategy
const initPassport = ()=>{
    passport.use('register', new localStrategy(
        {passReqToCallback:true, usernameField:'email'}, async(req, username, passport, done) =>{
            const {name, last_name, email, password} = req.body;
            try {
                let user = await userModel.findOne({email: username})
                if (user) {
                    console.log('usuario ya existe ');
                    return done(null, false)
                } else{
                    const result = {
                        name,
                        last_name,
                        email,
                        password: createHash(password)
                    }
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
    
            passport.deserializeUser(async(user, done) =>{
            let usuario = await userModel.findById(user._id)
            done(null, usuario)
            })
            passport.use('login', new localStrategy(
                {passReqToCallback:true, usernameField:'email'}, async(req, username, passport, done) =>{
                    try {
                        const password = req.body.password
                        const user = await userModel.findOne({email: username}).lean()
                        if(!user){
                            console.log('el usuario no existe');
                            return done(null, false)
                        } if (!password) {
                            console.log('Debe ingresar una contraseña');
                            return done(null, false)
                        }
                        if (!isValidPassword(user,password)) {
                            return done(null, false)
                        } else {
                            return done(null, user)
                        }
                    } catch (error) {
                        return done('error al obtener el usuario ' + error)
                    }
                }
                ))
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done)=>{
        let user = await githubService.findById(id)
        done(null, user)
    })

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
                    email: profile._json.email,
                    password:''
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
}

export default initPassport;