import express from 'express';
import { checkUser } from '../middlewares/auth.js';
import { productService } from '../services/product.service.js';

export const products = express.Router();

// GET con limit

products.get('/', checkUser, async (req, res) => {
  try {
    const queryParams = req.query;
    const user = req.session.user.first_name;
    const role = req.session.user.role;

    const paginatedProductsResponse = await productService.getAll(queryParams);
    const paginatedProducts = paginatedProductsResponse.modifiedProducts;
    const paginated = paginatedProductsResponse.products;
    res
      .status(200)
      .render('products', { products: paginatedProducts, paginated: paginated, user, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID

products.get('/:pid', checkUser, async (req, res) => {
  try {
    const id = req.params.pid;
    const productById = await productService.getById(id);

    if (productById) {
      res.status(200).render('products', { productById: [productById] });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
