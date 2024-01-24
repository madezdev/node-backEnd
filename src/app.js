import express from "express";
import __dirname from "./utils/utils.mjs";
import productRouter from "./routes/product.router.mjs";
import cartRouter from "./routes/cart.router.mjs";

const app = express();
const PORT = 8080;
const upload = (multer({ storage: storage }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));


app.post("/api/products", productRouter);
app.use("/api/products", productRouter);
app.use("/api/product/pid", productRouter);
app.put("/api/product/pid", productRouter);
app.delete("/api/product/pid", productRouter);
app.post('/upload', upload.single('product'), (req, res) => {
  //Imagenes
  console.log(req.body)
  console.log(req.file)
  res.send("Imagen subida")
})


app.post("/api/carts", cartRouter);
app.use("/api/carts", cartRouter);
app.use("/api/cart/cid", cartRouter);
app.post('/api/carts/:cid/product/:pid', cartRouter);





app
  .listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error al iniciar el servidor:", err.message);
  });
