import { Router } from "express";
import passport from "passport";
import { createUser, current, failLogin, failRegister, getGithubUser, logOut, userLogin } from "../controllers/session.controller.js";
import { authToken, strategyPassport } from "../utils.js";

const router = Router()


router.get('/github', passport.authenticate('github',{scope:['user:email']}, async(req,res)=>{}))

router.get('/', passport.authenticate('github', {failureRedirect:'/'}), getGithubUser)

router.post('/register',strategyPassport('register'), createUser)

router.get('/failregister', failRegister)

router.post('/login',strategyPassport('login'), userLogin)

router.get('/faillogin', failLogin)

router.delete('/login', logOut)


router.get('/current', passport.authenticate('jwt'), current)

export default router