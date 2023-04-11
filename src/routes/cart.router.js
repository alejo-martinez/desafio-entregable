import { Router } from "express";
import {__dirname, notAdmin} from '../utils.js'
import { createCart, getCartId, addProductInCart, getCarts, updateCart, updateProductInCart, deleteCart, deleteProductInCart, endPurchase } from "../controllers/cart.controller.js";

const router = Router()


router.post('/', createCart)

router.get('/', getCarts)

router.get('/:cid', getCartId)

router.post('/:cid/purchase', endPurchase)

router.post('/:cid/products/:pid', notAdmin, addProductInCart)

router.put('/:cid', updateCart)

router.put('/:cid/products/:pid', updateProductInCart)

router.delete('/:cid', deleteCart)

router.delete('/:cid/products/:pid', deleteProductInCart)

export default router;