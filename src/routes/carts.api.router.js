import express from 'express';
import { cartService } from '../services/cart.service.js';

export const cartsApiRouter = express.Router();

// GET /

cartsApiRouter.get('/', async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
