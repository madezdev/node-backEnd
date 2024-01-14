import express from "express";
import bodyParser from "body-parser";
import ProductManagement from "./managers/product.js";

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const productManager = new ProductManagement();

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getAllProducts(limit);
    res.send({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/papa',(request,response)=>{
    response.send('Hola express');
})


// Ruta para obtener un producto por ID
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await productManager.loadFromFile();
    const product = await productManager.getProductById(productId);
    if (product) {
      res.send({ product });
    } else {
      res
        .status(404)
        .json({ error: `Producto con ID ${productId} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  }).on('error', (err) => {
    console.error('Error al iniciar el servidor:', err.message);
  });
