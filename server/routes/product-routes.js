import express from 'express';

import { createProduct, deleteProduct, getProducts, envShow } from '../controllers/product-controller.js'

const router = express.Router();

router.get('/', getProducts);
router.post('/create', createProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/env', envShow);

export default router;