import fs from "node:fs/promises";
import __dirname from "../utils/utils.mjs";
import ProductManagement from "./productManager.mjs";


class CartManagement {
  constructor() {
    this.idIncrement = 0;
    this.carts = [];
    this.path = `${__dirname}/../public/carts.json`;
  }

  async loadFromFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar desde el archivo:", error.message);
      throw error;
    }
  }

  async saveToFile() {
    try {
      const jsonData = JSON.stringify(this.carts, null, 2);
      await fs.writeFile(this.path, jsonData);
      console.log("Datos guardados en el archivo con éxito en la carpeta.");
    } catch (error) {
      console.error("Error al guardar en el archivo:", error.message);
      throw error;
    }
  }

  async addCart() {
    try {
      await this.loadFromFile();
      const maxId = this.carts.reduce(
        (max, cart) => (cart.id > max ? cart.id : max),
        0
      );
      const newCart = { id: maxId + 1, products: [] };
      this.carts.push(newCart);
      await this.saveToFile();
      console.log("Carrito agregado con éxito.");
    } catch (error) {
      console.error("Error al agregar el carrito:", error.message);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      await this.loadFromFile();
      return this.carts;
    } catch (error) {
      console.error("Error al obtener los carritos:", error.message);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      await this.loadFromFile();
      const cart = this.carts.find((cart) => cart.id === id);

      if (!cart) {
        console.error(`Error: el carrito con el id ${id} no existe.`);
      }

      return cart;
    } catch (error) {
      console.error(`Error al obtener el carrito con ID ${id}:`, error.message);
      throw error;
    }
  }

  async addProductCart(id, idProd, quantity) {
    try {
      await this.loadFromFile();
      const cart = await this.getCartById(id);
  
      if (!cart) {
        throw new Error(`El carrito con el id ${id} no existe.`);
      }
      const productManager = new ProductManagement();
      const product = await productManager.getProductById(idProd);
  
      if (!product) {
        throw new Error(`El producto con el id ${idProd} no existe.`);
      }
  
      const existingProductIndex = cart.products.findIndex((p) => p.id === idProd);
  
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        const productToAdd = { id: idProd, quantity: quantity };
        cart.products.push(productToAdd);
      }
  
      await this.saveToFile();
      console.log("Producto agregado al carrito con éxito.");
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error.message);
      throw error;
    }
  }
  
}

export default CartManagement;
