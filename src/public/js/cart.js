const carritoId = localStorage.getItem('cart-id');
const addToCart = document.querySelectorAll('.addToCart');
const deleteFromCart = document.querySelectorAll('.deleteFromCart');
const deleteCart = document.querySelectorAll('.deleteCart');
const cartIcon = document.getElementById('cartIcon');

if (!carritoId) {
  alert('no id');

  const data = {};

  fetch(`/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response:', data);
      localStorage.setItem('cart-id', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    window.location.href = `/carts/${carritoId}`;
  });
}

addToCart.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-productid');

    addProductToCart(productId);

    Swal.fire({
      title: 'Producto añadido al carrito',
      text: 'El producto ha sido añadido al carrito de compras.',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ir al carrito',
      cancelButtonText: 'Seguir comprando',
    }).then(result => {
      if (result.isConfirmed) {
        window.location.href = `/carts/${carritoId}`;
      }
    });
  });
});

deleteFromCart.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-productid');
    Swal.fire({
      title: 'Eliminar del carrito',
      text: '¿Estás seguro de que quieres eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        deleteProductToCart(productId);
        Swal.fire({
          title: 'Carrito eliminado',
          text: 'El producto ha sido eliminado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.href = `/carts/${carritoId}`;
        });
      }
    });
  });
});

deleteCart.forEach(button => {
  button.addEventListener('click', () => {
    const cartId = button.getAttribute('data-cartid');
    Swal.fire({
      title: 'Eliminar carrito',
      text: '¿Estás seguro de que quieres eliminar este carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        deleteAllCart(cartId);
        Swal.fire({
          title: 'Carrito eliminado',
          text: 'El carrito ha sido eliminado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.href = `/carts/${carritoId}`;
        });
      }
    });
  });
});

function addProductToCart(productId) {
  const products = { products: { product: productId } };
  const cartId = localStorage.getItem('cart-id');
  fetch(`/carts/${cartId}/product/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Producto añadido al carrito:', data);
    })
    .catch(error => {
      console.error('Error al añadir el producto al carrito:', error);
    });
}

function deleteProductToCart(productId) {
  const cartId = localStorage.getItem('cart-id');
  fetch(`/carts/${cartId}/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log('Producto eliminado del carrito:', data);
    })
    .catch(error => {
      console.error('Error al eliminar el producto del carrito:', error);
    });
}

function deleteAllCart(cartId) {
  fetch(`/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log('Carrito eliminado:', data);
    })
    .catch(error => {
      console.error('Error el carrito:', error);
    });
}
