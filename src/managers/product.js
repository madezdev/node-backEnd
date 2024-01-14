import fs from "fs/promises";
import __dirname from "../utils/utils.js";

class ProductManagement {
  constructor() {
    this.autoIncrementId = 0;
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
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
  
      return product;
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error.message);
      throw error; 
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    await this.loadFromFile();
    //Validacion de datos
    if (!title || !description || !price || !thumbnail || !code || !stock) {
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

    const product = {
      id: this.autoIncrementId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    console.log(`Producto ${title} agregado con exito`);
    this.saveToFile();
  }

  async updateProduct(id, updatedProduct) {
    
    await this.loadFromFile();
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error(`Error: el producto con el id ${id} no existe.`);
      return;
    }
    // Copiar el producto existente para no modificar el objeto original
    const existingProduct = { ...this.products[index] };

    // Actualizar solo los campos proporcionados en updatedProduct
    for (const key in updatedProduct) {
      if (Object.prototype.hasOwnProperty.call(updatedProduct, key)) {
        existingProduct[key] = updatedProduct[key];
      }
    }

    // Normalizar y validar los datos actualizados
    const { title, description, price, thumbnail, code, stock } = existingProduct;
    existingProduct.title = title.trim().toLowerCase();
    existingProduct.description = description.trim().toLowerCase();
    existingProduct.thumbnail = thumbnail.trim().toLowerCase();
    existingProduct.code = code.trim().toLowerCase();
    existingProduct.price = parseFloat(price);
    if (isNaN(existingProduct.price) || existingProduct.price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }
    existingProduct.stock = parseInt(stock);
    if (isNaN(existingProduct.stock) || existingProduct.stock <= 0) {
      throw new Error("El stock debe ser un número positivo");
    }

    this.products[index] = existingProduct;

    await this.saveToFile();

    console.log(`Producto con id ${id} actualizado con éxito.`);
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
