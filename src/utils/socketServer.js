import { Server } from 'socket.io';
import { msgModel } from '../DAO/models/msgs.model.js';
import { productService } from '../services/product.service.js';

export function connectSocketServer(httpServer) {
  // CONFIG DE SOCKET.IO
  const socketServer = new Server(httpServer);

  function validateProductFields(newProd) {
    const requiredFields = ['title', 'description', 'category', 'price', 'code', 'stock'];
    const typeChecks = {
      title: 'string',
      description: 'string',
      category: 'string',
      price: 'number',
      code: 'string',
      stock: 'number',
    };

    for (const field of requiredFields) {
      if (!newProd[field]) {
        console.log(`El campo '${field}' es obligatorio`);
        return false;
      }

      if (typeof newProd[field] !== typeChecks[field]) {
        console.log(`El campo '${field}' debe ser de tipo '${typeChecks[field]}'`);
        return false;
      }
    }

    return true;
  }

  socketServer.on('connection', async socket => {
    console.log(`New client: ${socket.id}`);

    socket.on('new-product', async newProd => {
      try {
        if (!validateProductFields(newProd)) {
          return;
        }

        // Validar que no se repita el código
        const currentProducts = await productService.getAllProducts();
        const codeAlreadyExists = currentProducts.some(prod => prod.code === newProd.code);

        if (codeAlreadyExists) {
          console.log(`Ya existe un producto con el código ${newProd.code}`);
          return;
        }

        // Validar y establecer el valor por defecto para el campo status
        const status = typeof newProd.status === 'boolean' ? newProd.status : true;

        // Agregar el producto al arreglo con un id autoincrementable
        const newProduct = {
          ...newProd,
          status,
        };
        await productService.createProduct(newProduct);

        const productsList = await productService.getAllProducts();
        socketServer.emit('products', productsList);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('delete-product', async productId => {
      try {
        await productService.deleteProduct(productId);

        const productsList = await productService.getAllProducts();
        socketServer.emit('products', productsList);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('msg_front_to_back', async msg => {
      try {
        await msgModel.create(msg);
      } catch (e) {
        console.log(e);
      }

      try {
        const msgs = await msgModel.find({}).exec();
        socketServer.emit('listado_de_msgs', msgs);
      } catch (e) {
        console.log(e);
      }
    });
  });
}
