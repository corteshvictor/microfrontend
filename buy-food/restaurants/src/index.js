const restaurants = [
  {
    id: 1,
    name: "Restaurante 1",
    description: "Descripción del Restaurante 1",
  },
  {
    id: 2,
    name: "Restaurante 2",
    description: "Descripción del Restaurante 2",
  },
  {
    id: 3,
    name: "Restaurante 3",
    description: "Descripción del Restaurante 3",
  },
];

let htmlRestaurants = `<h2>Microfrontend - lista de restaurantes</h2>`;
for (let restaurant of restaurants) {
  htmlRestaurants += `<section>
    <h3>${restaurant.name}</h3>
    <p>${restaurant.description}</p>
  </section>`;
}

document.getElementById("app-restaurants").innerHTML = htmlRestaurants;
