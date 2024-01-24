import { Router } from "express";
import CartManagement from "../managers/cartManager.mjs";
import ProductManagement from "../managers/productManager.mjs";

const router = Router();

const cartManager = new CartManagement();
const productManager = new ProductManagement();

router.get("/", async (req, res) => {
  try {
    const cartList = await cartManager.getAllCarts();
    res.send(cartList);
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

router.post("/", async (req, res) => {
  try {
    await cartManager.addCart();
    res.send("Carrito creado exitosamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(id);
    if (!cart) {
      res
        .status(404)
        .json({ error: `El carrito con el id ${req.params.cid} no existe.` });
      return;
    }
    res.send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {

    const { quantity = 1 } = req.body;

    const idCart = parseInt(req.params.cid);
    const idProd = parseInt(req.params.pid);

     await cartManager.addProductCart( idCart, idProd, quantity )
    res.status(201).json({ message: 'Producto agregado al carrito con éxito.' });

    
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw error;
  }
});

export default router;
