import { Router } from "express";
import userController from "../controllers/user.controller.js";
const router = Router();

router.get('/', userController.get);
router.delete('/', userController.deleteUserInactive);
router.put('/', userController.updateRol);
router.delete('/:uid', userController.deleteUser);
export default router;