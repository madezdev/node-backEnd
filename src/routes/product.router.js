import { Router } from 'express';

const router = Router();
const products = [];

router.get('/product', (req, res) => {
    res.json(products);
});

