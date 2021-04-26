const products = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripción del producto 1",
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripción del producto 2",
  },
  {
    id: 3,
    name: "Producto 3",
    description: "Descripción del producto 3",
  },
];

let htmlProducts = `<h2>Microfrontend - lista de productos</h2>`;
for (let product of products) {
  htmlProducts += `<section>
    <h3>${product.name}</h3>
    <p>${product.description}</p>
  </section>`;
}

document.getElementById("app-products").innerHTML = htmlProducts;
