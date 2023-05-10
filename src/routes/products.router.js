import { Router } from "express";
import { createProduct, getProductId, getProducts, updateProductById, deleteProductById } from "../controllers/products.controller.js";
import { uploader } from "../utils.js";

const router = Router();


router.get('/', getProducts)

router.get('/:pid', getProductId)
 
router.post('/', uploader.single('file'), createProduct)

router.put('/:pid', updateProductById)

router.delete('/:pid', deleteProductById)

export default router