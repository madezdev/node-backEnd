import { Router } from "express";
import ProductManagement from "../managers/productManager.mjs";

const router = Router();

const productManager = new ProductManagement();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const productList = await productManager.getAllProducts(limit);
    res.send(productList);
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
      res
        .status(404)
        .json({ error: `El producto con el id ${req.params.pid} no existe.` });
      return;
    }
    res.send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    } = req.body;
    await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    );
    res.send("Producto creado exitosamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    } = req.body;
    const product = await productManager.updateProduct(id, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    if (product.startsWith("Producto con id")) {
      res.send("Producto actualizado exitosamente");
    } else {
      res.status(404).json({ error: product });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productManager.deleteProduct(id);

    res.send("Producto eliminado exitosamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

export default router;
