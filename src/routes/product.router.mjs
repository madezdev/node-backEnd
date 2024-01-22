import { Router } from "express";
import ProductManagement from '../managers/product.mjs';

const router = Router();

const productManager = new ProductManagement();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const productList = await productManager.getAllProducts(limit);
    res.send( productList );
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

router.get("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        if (!product) {
            res.status(404).json({ error: `El producto con el id ${req.params.pid} no existe.` });
            return;
        }
        res.send( product );
    } catch (error) {
        res.status(500).json({ error: error.message });
        throw error;
    }
});

export default router;
