import { Router } from "express";
import passport from "passport";
import { createUser, current, failLogin, failRegister, getGithubUser, logOut, userLogin } from "../controllers/session.controller.js";
import { authToken, strategyPassport } from "../utils.js";

const router = Router()


router.get('/github', passport.authenticate('github',{scope:['user:email']}, async(req,res)=>{

}))

router.get('/', passport.authenticate('github', {failureRedirect:'/login'}), getGithubUser)

router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister', session: false}), createUser)

router.get('/failregister', failRegister)

router.post('/login',passport.authenticate('login',{session:false, failureMessage:true}), userLogin)
//{failureRedirect:'/faillogin'}
// router.post('/updatepass', updatePass)

router.get('/faillogin', failLogin)

router.delete('/login', logOut)

// router.delete('/resetpass/:email', passReset)

router.get('/current', passport.authenticate('jwt'), current)

export default router