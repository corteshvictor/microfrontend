const textContent = `<h2>Componente carrito de compras</h2>
<p>Tienes <strong>${Math.round(
  Math.random() * 5
)}</strong> artículos en su carrito de compras</p>`;

document.getElementById("app-cart").innerHTML = textContent;
