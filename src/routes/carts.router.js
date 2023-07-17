import express from 'express';
import { checkUser } from '../middlewares/auth.js';
import { cartService } from '../services/cart.service.js';

export const cartsRouter = express.Router();

// GET /:cid

cartsRouter.get('/:cid', checkUser, async (req, res) => {
  try {
    const cartId = req.params.cid;
    const user = req.session.user.first_name;
    const isAdmin = req.session.user.role;

    const cart = await cartService.getCart(cartId);

    const plainCart = cart.products.map(cart => cart.toObject());

    if (cart) {
      res.status(200).render('carts', { plainCart, cartId: [cartId], user, isAdmin });
    } else {
      res.status(404).json({ message: `Carrito ${cartId} no encontrado` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST

cartsRouter.post('/', checkUser, async (req, res) => {
  try {
    const products = req.body;
    const newCart = await cartService.createCart(products);
    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /:cid

cartsRouter.post('/:cid', checkUser, async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body;
    const cart = await cartService.addToCart(cartId, products);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /:cid/product/:pid

cartsRouter.put('/:cid/product/:pid', checkUser, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProductToCart(cid, pid);
    res.status(201).json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE /:cid/product/:pid

cartsRouter.delete('/:cid/product/:pid', checkUser, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.deleteProduct(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// DELETE /:cid

cartsRouter.delete('/:cid', checkUser, async (req, res) => {
  try {
    const cid = req.params.cid;
    await cartService.deleteCart(cid);
    res.status(200).json({ status: 'success', message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
