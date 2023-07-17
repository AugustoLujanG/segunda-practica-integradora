import fs from 'fs';

export default class ProductManager {
  constructor(fileName) {
    this.fileName = fileName;
    this.products = [];
    this.thumbnailsPath = '/';
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.fileName, 'utf-8');
      if (data) {
        this.products = JSON.parse(data);
      }
    } catch (err) {
      console.log(`Error al leer el archivo: ${err.message}`);
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.fileName, JSON.stringify(this.products), 'utf-8');
    } catch (err) {
      console.log(`Error al escribir archivo: ${err.message}`);
    }
  }

  async addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (
      !product.title ||
      !product.description ||
      !product.category ||
      !product.price ||
      !product.code ||
      !product.stock
    ) {
      console.log('Todos los campos son obligatorios');
      return;
    }

    // Validar el tipo de dato de los campos
    if (typeof product.title !== 'string') {
      console.log("El campo 'title' debe ser una cadena de caracteres");
      return;
    }

    if (typeof product.description !== 'string') {
      console.log("El campo 'description' debe ser una cadena de caracteres");
      return;
    }

    if (typeof product.category !== 'string') {
      console.log("El campo 'category' debe ser una cadena de caracteres");
      return;
    }

    if (typeof product.price !== 'number') {
      console.log("El campo 'price' debe ser un número");
      return;
    }

    if (typeof product.code !== 'string') {
      console.log("El campo 'code' debe ser una cadena de caracteres");
      return;
    }

    if (typeof product.stock !== 'number') {
      console.log("El campo 'stock' debe ser un número");
      return;
    }

    // Validar que no se repita el código
    const codeAlreadyExists = this.products.some(prod => prod.code === product.code);

    if (codeAlreadyExists) {
      console.log(`Ya existe un producto con el código ${product.code}`);
      return;
    }

    // Validar y establecer el valor por defecto para el campo status
    const status = typeof product.status === 'boolean' ? product.status : true;

    // Validar y obtener las rutas completas de las imágenes (thumbnails)
    const thumbnails = Array.isArray(product.thumbnails) ? product.thumbnails : [];

    const thumbnailsWithFullPath = thumbnails.map(thumbnail => this.thumbnailsPath + thumbnail);

    // Agregar el producto al arreglo con un id autoincrementable
    const newProduct = {
      ...product,
      id: this.products.length + 1,
      status,
      thumbnails: thumbnailsWithFullPath, // Agregar las rutas completas de las imágenes
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log(`Producto ${newProduct.id} - ${newProduct.title} agregado`);
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
      return product;
    }
  }

  async updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      console.log(`Producto ${id} no encontrado`);
      return;
    }

    this.products[productIndex] = {
      ...updatedProduct,
      id,
    };

    this.saveProducts();
    console.log(`Producto ${id} actualizado`);
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      console.log(`Producto ${id} no encontrado`);
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
    console.log(`Producto ${id} eliminado`);
  }
}
