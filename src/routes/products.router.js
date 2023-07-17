import express from 'express';
import { checkUser } from '../middlewares/auth.js';
import { productService } from '../services/product.service.js';

export const productsRouter = express.Router();

// GET con limit

productsRouter.get('/', checkUser, async (req, res) => {
  try {
    const queryParams = req.query;

    const products = await productService.getJson(queryParams);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID

productsRouter.get('/:pid', checkUser, async (req, res) => {
  try {
    const id = req.params.pid;
    const productById = await productService.getById(id);

    if (productById) {
      res.status(200).render('home', { productById: [productById] });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
