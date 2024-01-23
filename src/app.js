import express from "express";
import __dirname from "./utils/utils.mjs";
import productRouter from "./routes/product.router.mjs";

const app = express();
const PORT = 8080;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use("/api/product", productRouter);
app.use("/api/product/pid", productRouter);
app.post("/api/new-product", productRouter);
app.put("/api/product/pid", productRouter);
app.delete("/api/product/pid", productRouter);




app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  }).on('error', (err) => {
    console.error('Error al iniciar el servidor:', err.message);
  });
