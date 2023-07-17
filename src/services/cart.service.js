import { cartModel } from '../DAO/models/carts.model.js';
import { productModel } from '../DAO/models/products.model.js';

class CartService {
  async createCart(products) {
    try {
      const cart = await cartModel.create(products);
      const cartId = cart.toObject();
      const cartIdString = cartId._id.toString();
      return cartIdString;
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  async getCart(cartId) {
    try {
      const cart = await cartModel.findOne({ _id: cartId }).exec();
      return cart;
    } catch (error) {
      throw new Error('Error al obtener el carrito');
    }
  }

  async addToCart(cartId, products) {
    try {
      const cart = await cartModel.findByIdAndUpdate(cartId, { products }, { new: true }).exec();
      return cart;
    } catch (error) {
      throw new Error('Error al actualizar el carrito');
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId).exec();
      const product = await productModel.findById(productId).exec();
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (!product) {
        throw new Error('Product not found');
      }

      const productIndex = cart.products.findIndex(p => {
        const product = p.product.toObject();
        const productString = product._id.toString();
        return productString === productId;
      });
      if (productIndex === -1) {
        cart.products.push({ product: product._id, quantity: 1 });
        await cart.save();
      } else {
        cart.products[productIndex].quantity += 1;
        await cart.save();
      }

      return cart;
    } catch (error) {
      throw new Error('Error al agregar producto');
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId).exec();
      const productIndex = cart.products.findIndex(p => {
        const product = p.product.toObject();
        const productString = product._id.toString();
        return productString === productId;
      });
      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error removing product from cart');
    }
  }

  async deleteCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId).exec();
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error('Error clearing cart');
    }
  }
}

export const cartService = new CartService();
