import fs from 'fs';
import ProductManager from './productManager.js';

const productManager = new ProductManager('db/products.json');

export default class CartManager {
  constructor(fileName) {
    this.fileName = fileName;
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.fileName, 'utf-8');
      if (data) {
        this.carts = JSON.parse(data).map(cart => ({
          ...cart,
          products: cart.products || [],
        }));
      }
    } catch (err) {
      console.log(`Error al leer el archivo del carrito: ${err.message}`);
    }
  }
  saveCarts() {
    try {
      fs.writeFileSync(this.fileName, JSON.stringify(this.carts), 'utf-8');
    } catch (err) {
      console.log(`Error al escribir el archivo del carrito: ${err.message}`);
    }
  }

  async createCart() {
    const newCart = {
      id: this.carts.length + 1,
      products: [],
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  async getCarts() {
    return this.carts;
  }

  async getCartById(id) {
    const cart = this.carts.find(cart => cart.id === id);
    if (cart) {
      return cart;
    }
  }

  async addProductToCart(cartId, productId) {
    const cart = this.carts.find(cart => cart.id === cartId);

    const existingProduct = cart.products.find(product => product.id === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const product = await this.getProductById(productId);
      if (!product) {
        return;
      }

      cart.products.push({
        id: product.id,
        quantity: 1,
      });
    }

    this.saveCarts();
    console.log(`Producto ${productId} agregado al carrito ${cartId}`);
  }

  async getProductById(id) {
    const product = await productManager.getProductById(id);
    console.log(product);
    return product;
  }
}
