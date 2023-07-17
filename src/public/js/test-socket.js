const socket = io();

const addProduct = document.getElementById('addProductForm');
const titleProd = document.getElementById('titleProd');
const descProd = document.getElementById('descProd');
const catProd = document.getElementById('catProd');
const priceProd = document.getElementById('priceProd');
const codeProd = document.getElementById('codeProd');
const stockProd = document.getElementById('stockProd');
const url = document.getElementById('urlInput');

const deleteProductForm = document.getElementById('deleteProductForm');
const id = document.getElementById('productId');

socket.on('products', productsList => {
  const productListContainer = document.getElementById('dynamic-list');
  productListContainer.innerHTML = ''; // Limpiar el contenido existente

  productsList.forEach(product => {
    const productHTML = `
    <div class="col-md-3">
      <div class="card">
        <img class="card-img-top" src=${product.thumbnails} alt="" />
        <div class="card-body">
          <h2 class="card-title">${product.title}</h2>
          <p class="card-text">${product.description}</p>
          <p class="card-text">ID: ${product._id}</p>
          <p class="card-text">Código: ${product.code}</p>
          <p class="card-text">Categoría: ${product.category}</p>
          <p class="card-text">Stock: ${product.stock}</p>
          <p class="card-text">Precio: $${product.price}</p>
          <p class="card-text">Status: ${product.status}</p>
        </div>
      </div>
      <button class='btn btn-success mb-3 addToCart' data-productid='{{_id}}'>Añadir al carrito</button>
      </div>`;

    productListContainer.insertAdjacentHTML('beforeend', productHTML);
  });
});

addProduct.addEventListener('submit', e => {
  e.preventDefault();
  const newProd = {
    title: titleProd.value,
    description: descProd.value,
    code: codeProd.value,
    category: catProd.value,
    thumbnails: url.value,
    stock: parseInt(stockProd.value),
    price: parseInt(priceProd.value),
  };
  socket.emit('new-product', newProd);
  addProduct.reset();
});

deleteProductForm.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('delete-product', productId.value);
  deleteProductForm.reset();
});
