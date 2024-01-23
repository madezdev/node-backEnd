import fs from "fs/promises";
import __dirname from "../utils/utils.mjs";

class ProductManagement {
  constructor() {
    this.idIncrement = 0;
    this.products = [];
    this.path = `${__dirname}/../public/productos.json`;
  }

  async loadFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar desde el archivo:", error.message);
      throw error;
    }
  }

  async saveToFile() {
    try {
      const jsonData = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, jsonData);
      console.log("Datos guardados en el archivo con éxito en la carpeta.");
    } catch (error) {
      console.error("Error al guardar en el archivo:", error.message);
      throw error;
    }
  }

  async updateFile() {
    try {
      await fs.appendFile(this.path, JSON.stringify(this.products, null, 2));
      console.log("Datos actualizados en el archivo con éxito en la carpeta.");
    } catch (error) {
      console.error("Error al actualizar el archivo:", error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      await this.loadFromFile();
      if (!this.products.length === 0) {
        console.error("No hay productos cargados.");
        return;
      }
      return this.products;
    } catch (error) {
      console.error("Error al obtener todos los productos:", error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      await this.loadFromFile();
      const product = this.products.find((product) => product.id === id);

      if (!product) {
        console.error(`Error: el producto con el id ${id} no existe.`);
      }

      return product;
    } catch (error) {
      console.error(
        `Error al obtener el producto con ID ${id}:`,
        error.message
      );
      throw error;
    }
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status = true,
    category
  ) {
    await this.loadFromFile();

    //Validacion de datos
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category ||
      !thumbnail
    ) {
      throw new Error("Faltan datos para dar de alta al producto");
    }

    //Normalizacion de datos
    title = title.trim().toLowerCase();
    description = description.trim().toLowerCase();
    thumbnail = thumbnail.trim().toLowerCase();
    code = code.trim().toLowerCase();
    price = parseFloat(price);
    if (isNaN(price) || price <= 0) {
      throw new Error("El precio debe ser un numero positivo");
    }
    stock = parseInt(stock);
    if (isNaN(stock) || stock <= 0) {
      throw new Error("El stock debe ser un numero positivo");
    }

    //Validar que no se repita el title y code del producto.
    if (this.products.some((p) => p.title.trim().toLowerCase() === title)) {
      throw new Error(`Ya existe un producto con el mismo título ${title}`);
    }
    if (this.products.some((p) => p.code === code)) {
      throw new Error(`Ya existe un producto con el mismo code ${code}`);
    }

    const maxId = this.products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );

    const product = {
      id: maxId + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };

    this.products.push(product);
    console.log(`Producto ${title} agregado con exito`);
    this.saveToFile();
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock, status, category }
  ) {
    await this.loadFromFile();
    const index = this.products.findIndex((p) => p.id === parseInt(id));

    if (index !== -1) {
      this.products[index].title = title;
      this.products[index].description = description;
      this.products[index].price = price;
      this.products[index].thumbnail = thumbnail;
      this.products[index].code = code;
      this.products[index].stock = stock;
      this.products[index].status = status;
      this.products[index].category = category;

      await this.saveToFile();
      return `Producto con id ${id} actualizado con éxito.`;
    } else {
      return `Producto con id ${id} no se encontro.`;
    }
  }

  async deleteProduct(id) {
    try {
      await this.loadFromFile();
      this.products = this.products.filter((p) => p.id !== id);
      await this.saveToFile();
      console.log(`Producto con id ${id} eliminado con éxito.`);
    } catch (error) {
      console.error(
        `Error al eliminar el producto con ID ${id}:`,
        error.message
      );
    }
  }
}

export default ProductManagement;
