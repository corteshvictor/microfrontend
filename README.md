# Microfrontends

- [aplicación de comercio electrónico](#aplicación-de-comercio-electrónico)
- [Beneficios](#beneficios)
- [Resumen](#resumen)
- [Ejemplo a construir](#ejemplo-a-construir)
- [Categorías de Integración](#categorías-de-integración)
  - [Integración en tiempo de construcción (Build-Time Integration)](#integración-en-tiempo-de-construcción-build-time-integration)
  - [Integración en tiempo de ejecución (Run-Time Integration)](#integración-en-tiempo-de-ejecución-run-time-integration)
  - [Integración en el servidor (Server Integration)](#integración-en-el-servidor-server-integration)
- [Código del ejemplo a construir](#código-del-ejemplo-a-construir)

En este artículo vamos a tratar el lado técnico de los microfrontend, lo primero que vamos a cubrir es, exactamente lo que es un microfrontend y obviamente, una parte muy importante, la comprensión de lo que son y cómo usarlos.

Para entender realmente los microfrontends, primero quiero que imaginen que estamos construyendo una aplicación de comercio electrónico donde los clientes pueden pedir diferentes tipos de comidas a diferentes restaurantes.

## Aplicación de comercio electrónico

Para construir esta aplicación para ventas de comidas, quiero que tengamos presente los siguientes aspectos:

- Cuando el cliente ingresa a nuestro sitio web o aplicación, lo primero que queremos mostrar es la lista de los diferentes restaurantes que tiene disponible nuestra aplicación y sus restaurantes favoritos. Estos restaurantes se deben poder buscar y filtrar por diferentes tipos de comida u otros atributos que desee el cliente.
- Cuando el cliente ingresa a un restaurante, este le muestra su lista de productos, imágenes, precios, promociones y cualquier servicio adicional que brinde el restaurante, estos productos los puede agregar al carrito de comprar. Cabe aclarar que esta sección, es muy personalizada por cada restaurante, por ende, la lista y servicios es bastante diferente a la de los otros restaurantes.
- Después de que el cliente seleccionó sus productos y paso al carrito de compras, en esta sección se muestra los restaurantes con su listado de los productos, precio unitario, cantidad, subtotal, impuestos, valor total a cancelar, método de pago y cualquier otra cosa que quiera manejar la aplicación.

Teniendo en cuenta los tres puntos anteriores, podemos plantearnos los siguientes diseños para la solución de nuestra aplicación. Resalto que estos diseños se realizaron muy a la ligera, de seguro no son la mejor manera de resolver la problemática, ni mucho menos, tienen la mejor experiencia para el usuario. Estos diseños solo se hicieron con el fin de poder dar una idea de la problemática planteada.

![Diseños de la App](https://github.com/corteshvictor/microfrontend/blob/main/img/layouts.png?raw=true)
En resumidas cuentas, para nuestra aplicación, tenemos estas tres páginas o secciones separadas.

Imaginemos que estamos construyendo la aplicación utilizando un enfoque clásico donde tenemos una aplicación de una sola página, la famosa SPA (single-page application). Podríamos hacerlo con cualquier librería o framework como React, Svelte, Vue, Angular entre otros.

![SPA](https://github.com/corteshvictor/microfrontend/blob/main/img/img_1.png?raw=true)

Dentro del proyecto, vamos a tener todo el código entorno a la implementación, paginación para listar restaurantes, productos, toda la cantidad necesaria de código, para filtros, búsquedas, para implementar el carrito de comprar y todo el código necesario para que interactúen estas secciones entre ellas causando que todo nuestro código de nuestra aplicación este en una sola base o en un único proyecto.

Podemos decir que es una aplicación monolítica de una sola página, ahora bien, si quisiéramos convertir esto en una aplicación microfrontend, podemos mirar nuestras maquetas o diseños originales para identificar cada característica distinta y principal dentro ella.

Podemos notar que tenemos tres posibles características principales de nuestra aplicación que son distintas.

- la página del listado de restaurantes.
- la página del listado de productos.
- la pagina del carrito de la compra.

Después de identificar cada una de estas características principales, podemos dividir cada sección en su propia base de código para que estén separadas, por lo que podríamos tener todo el código para nuestro listado de restaurantes dentro de una SPA utilizando cualquier framework o librería mencionada anteriormente. A su vez, podríamos tener todo el código de nuestro listado de productos dentro de otra SPA y también podemos tener todo el código de nuestro carrito de compra dentro de una aplicación totalmente separada a las otras dos.

Apenas empezamos a dividir estas tres bases de código, vamos a encontrarnos con muchas cuestiones interesantes. Por ejemplo, si el usuario hace clic en el producto para añadirlo al carrito, claramente tenemos la necesidad de añadir este producto a la página del carrito de compras.

Dentro de un enfoque microfrontend, tanto como sea posible, tratamos de evitar la comunicación directa entre los proyectos, no hacer la adición de un producto directamente a la pagina del carrito de compras.

![No comunicar las aplicaciones](https://github.com/corteshvictor/microfrontend/blob/main/img/img_2.png?raw=true)

En su lugar, tendríamos que cada aplicación, hacer la comunicación entre las aplicaciones por medio del enrutamiento, desde una interfaz pasar los datos o algún tipo de solicitud a una API que gestiona todos los datos dentro de cada aplicación, dependiendo de la necesidad, puedes tomar otra vía, pero para el articulo y representemos la petición a una API.

![Peticiones a las API de cada App](https://github.com/corteshvictor/microfrontend/blob/main/img/img_3.png?raw=true)

Cada vez que un usuario cargue la aplicación del carro de compras para ver los productos que ha añadido a su carro, la aplicación del carro de compras haría una petición a esa misma API y obtendría un listado de todos los productos que hay en su carro. De esta forma puedes notar que no tenemos ningún tipo de comunicación directas entre las tres aplicaciones.

## Beneficios

Ahora te puedes preguntar, ¿Por qué usaríamos microfrontend, qué beneficio obtenemos al dividir estas características en aplicaciones separadas?

Hay un beneficio gigantesco que obtenemos, y es que cada una de estas aplicaciones puede ser considerada como aplicaciones independientes, totalmente separadas.

- No existe comunicación directa entre ellas.
- No hay dependencia directa entre ellas.

Lo que significa que podemos asignar la implementación del listado de restaurantes a un equipo de desarrollado No. 1, podemos asignar la aplicación del listado de productos a un equipo de desarrollo No. 2 y por último asignar la característica del carrito de compras a un equipo de desarrollo No. 3 totalmente diferentes a los otros equipos.

![App con equipos diferentes](https://github.com/corteshvictor/microfrontend/blob/main/img/img_4.png?raw=true)

Estos pueden ser tres equipos de desarrollo o ingeniería totalmente diferentes dentro de la empresa, hasta puedes utilizar un outsourcing para que construya cierta característica. Con esto, los equipos pueden decidir que hacer, tomar decisiones técnicas totalmente diferentes para implementar cada uno de estos proyectos.

#### Por ejemplo.

El equipo de desarrollo No. 1, puede decidir implementar React, el No. 2 se decide por Vue, mientras que el equipo de desarrollo No. 3 puede implementar Svelte. Obviamente queremos limitar el numero de framework y librarías que se utilizan en la empresa. Pero el punto aquí es, que cada equipo de desarrollo o ingeniería puede construir su aplicación con su propio estilo o stack de desarrollo preferido, lo que crean que funciona mejor para ellos.

## Resumen

Vamos a resumir lo que hemos hablado hasta el momento para centrar las ideas y tener el concepto un poco más claro.
Los microfrontend es donde tomamos una aplicación monolítica y la dividimos en múltiples aplicaciones más pequeñas, cada una de estas aplicaciones más pequeñas son responsables de una característica principal distinta de nuestro producto tanto como sea posible. Intentamos evitar que estas diferentes micro-aplicaciones se comuniquen entre sí directamente.

Hacemos uso de microfrontend porque permite que varios equipos de desarrollo trabajen en la misma aplicación global, pero en total aislamiento. Así, el equipo No.1 puede realizar cambios sin que estos rompan las otras secciones o características de la aplicación, pueden manejar las dependencias de su proyecto totalmente diferente a la de los otros equipos. Además, cuando empezamos a dividir nuestra aplicación en microfrontend, hace que cada una de estas partes más pequeñas sea mucho más fácil de entender y puedes hacer cambios sin romper accidentalmente alguna otra parte de nuestra aplicación global.

- ¿Qué son los microfrontend?
  -- Dividir una aplicación monolítica en varias aplicaciones más pequeñas.
  -- Cada aplicación más pequeña es responsable de una característica distinta del producto.
- ¿Por qué utilizarlos?
  -- Varios equipos de desarrollo pueden trabajar de forma aislada.
  -- Cada aplicación más pequeña es más fácil de entender y de realizar cambios.

## Ejemplo a construir

El siguiente ejemplo, es el que vamos a construir como nuestra aplicación para tener una mejor idea de como funciona todo este de microfronted. Vamos a realizar una aplicación muy simple, sencilla que no va a utilizar ningún framework o librería dentro de ella.

Vamos a realizar nuestra aplicación para comprar comida de diferentes restaurantes, listaremos las secciones para tener algunos restaurantes, productos a la venta y el número de artículos que tiene en el carro de compra.

**Nota:** Quiero dejar muy claro que, estamos trabajando con datos 100% falsos. No se va a utilizar API ni nada por el estilo, tampoco vamos a tener interacción, por ende, no tenemos ninguna adición real de artículos a un carro de compras, ni nada por el estilo. En realidad, sólo estamos intentado que aparezca textos planos en la pantalla cuando se ejecute la aplicación.

En primer lugar, tenemos un listado de diferentes restaurantes que están disponibles para seleccionar. También tenemos una lista de diferentes productos que están disponibles para la venta. Por último, tenemos una pagina del carrito de compras que va a mostrar el número de artículos que un usuario tiene en su carrito. Recordemos que toda esta información es texto plano, este número es un valor generado al azar que vamos a pegar en el código.

Nos dimos cuenta de inmediato que tenemos tres características distintas, podríamos decir que, en una aplicación monolítica, podemos tener un componente de la aplicación que tenga un componente para la lista de restaurantes, otro para la lista de artículos y un componente para el carro de compras.

![Solución sin microfrontend](https://github.com/corteshvictor/microfrontend/blob/main/img/img_5.png?raw=true)

#### ¿Cómo enfocaríamos esto si estuviéramos haciendo uso de microfrontend?

Podemos decidir tomar cada característica o sección importante de nuestro producto y ponerlo en una aplicación microfrontend diferente para que consiguiésemos tener micro-aplicaciones y no una sola aplicación que contiene todo el código relacionado con nuestras características planteadas.

Entonces, lo que queremos es, crear una aplicación que solo contenga el código necesario para obtener el listado de nuestros restaurantes y mostrarlos en pantalla, otra aplicación para obtener el listado de los productos y visualizarlo en la página y una tercera aplicación microfrontend que contenga todo el código necesario para conseguir que el carrito muestre su información.

![Solución con microfrontend](https://github.com/corteshvictor/microfrontend/blob/main/img/img_6.png?raw=true)

Ahora bien, ya podemos darnos cuenta de que, si solo tenemos estos tres microfrontends, podemos tener un reto bastante significante para conseguir que estas cosas se muestren en nuestra pagina o pantalla. En otras palabras, ¿cómo sabemos que el _MFE No. 1_ necesita ser mostrado en la parte de arriba de nuestra pagina, que el _MFE No. 2_ tiene que estar ubicado en el centro y que el _MFE No. 3_ tiene que ser mostrado en la parte inferior?

Para dar solución, muy a menudo acabamos creando una cuarta aplicación microfronted a lo que llamamos o solemos referirnos como el Contenedor **(Container)**. El contenedor es el que decide cuando y dónde mostrar todos los diferentes microfronted que tenemos.

![Container](https://github.com/corteshvictor/microfrontend/blob/main/img/img_7.png?raw=true)

Para construir esta pequeña aplicación falsa, vamos a terminar haciendo 4 pequeños proyectos. Vamos a realizar el contenedor, un microfronted para mostrar el listado de restaurantes, otro para un listado de productos y uno ultimo para mostrar nuestro carrito de compras.

Añadiendo un poco de lógica a nuestra aplicación contenedora, vamos a decidir cuando y donde mostrar cada uno de estos microfronted, esto implica que, el contenedor necesita tener acceso al código fuente de la lista de restaurantes, lista de productos y al carrito de compras en algún momento. Para tener acceso, existen diferentes formas de implementarlo. Entonces, nos vamos a centrar en las diferentes formas de asegurar que el contenedor tenga acceso a nuestras características, todas estas formas o procesos, se conoce como integración **(integration)**.

**Nota:** Antes de hablar de cualquier método de integración, quiero resaltar que, existen muchas soluciones o muchas maneras diferentes de realizar la integración, pero todas estas soluciones posibles, ninguna es perfecta, todas tienen sus ventajas y desventajas. Por lo tanto, la decisión de utilizar una de ellas dependerá de la necesidad o los requerimientos de la aplicación.

## Categorías de Integración

**_Siempre que escuches el término integración, tienes que pensar en cómo vamos a ensamblar u orquestar nuestros diferentes microfrontend._**

Quiero mencionar 3 principales categorías de integración.

### Integración en tiempo de construcción (Build-Time Integration)

Es conocido también como, integración en tiempo de compilación (Compile-Time Integration). Cuando hablamos de esta categoría, vamos a asegurarnos de que, antes de que el contenedor se cargue en el navegador, tenga acceso al código fuente de nuestros microfrontends (Lista de restaurantes, lista de productos y al carrito de compra).

Existen diferentes formas o métodos para implementar la integración en tiempo de construcción, pero quiero dar mi enfoque con un ejemplo muy parecido a un sistema de gestión de paquetes, como NPM, para que sea una manera bastante directa de entenderlo.

Tenemos un equipo desarrollando nuestra aplicación para la lista de restaurantes, cuando este equipo termina el proyecto, informan que están listos para desplegar la aplicación. En este momento, el equipo de administrar los restaurantes publicaría la lista de restaurantes como un paquete de NPM para que este disponible y pueda ser instalado en cualquier proyecto.

Ya después de librado el paquete, el equipo encargado del Contenedor, instala este paquete como una dependencia del proyecto y el equipo comienza a construir su aplicación contenedora. El resultado final, sería un proyecto que tiene todo el código fuente del contenedor y todo el código fuente de nuestra lista de restaurantes.

#### Ventas y desventajas de este enfoque:

- La Ventaja es que, es realmente fácil de configurar este flujo y es relativamente fácil de entender también. porque se produce un único paquete JavaScript público que nos permite duplicar dependencias comunes de nuestras diversas aplicaciones. Este es un flujo muy común y seguro, ya lo has implementado, pero de pronto no eras consciente que estabas realizando una integración en tiempo de compilación.
- La desventaja de este enfoque es que, cada vez que la aplicación de la lista de restaurantes necesita ser redistribuida, tendríamos que volver a desplegar el contenedor también. Nos tocaría que volver a compilar y lanzar cada micro-aplicación para lanzar un cambio en cualquier parte individual del producto, actualizar las dependencias y desplegar el contenedor.
- Otra desventaja es que, el contenedor tiene acceso completo a todas nuestras micro-aplicaciones y eso puede ser muy tentador de querer acoplar las aplicaciones y esto es algo que debemos evitar en una arquitectura de microfrontend.

### Integración en tiempo de ejecución (Run-Time Integration)

Es conocido también como, integración del lado del cliente (Client-Side Integration). Cuando hablamos de esta categoría, tenemos que entender que, después de que el contenedor se cargue en el navegador, es que va a tener acceso al código fuente de nuestra lista de restaurante.

De nuevo resalto que existen diferentes métodos para implementar esto, pero quiero dar un ejemplo que sea una manera fácil de comprender una integración en tiempo de ejecución.

Nuevamente, tenemos un equipo de desarrollando nuestra aplicación de lista de restaurantes, dicen que es el momento de desplegar, en ese punto, en lugar de desplegar el proyecto a un sistema de gestión de paquetes, el equipo despliega su aplicación en un enlace URL, algo como, https://www.mi-app-ventasdecomida.com/lista-de-restaurantes.js, este archivo de JavaScript tiene todo el código necesario de la aplicación.

El contenedor es liberado en la dirección raíz, https://www.mi-app-ventasdecomida.com y en ese momento que un cliente ingrese a ese enlace raíz, el contenedor se carga y obtendría el enlace de nuestra lista de restaurantes, el archivo JavaScript. En este enfoque, en contenedor sólo tiene acceso al código de nuestra micro-aplicación después de que el contenedor haya cargado en el navegador.

#### Ventajas y desventajas.

- La ventaja es que podemos desplegar independientemente nuestra micro-aplicación sin tener que depender o desplegar el contenedor. Cada proyecto se despliega cuando se considere necesario.
- Otra ventaja es que podemos tener fácilmente diferentes versiones en vivo de la aplicación de la lista de restaurantes. Podemos estar realizando pruebas de diferentes versiones de la lista de restaurantes y el contenedor decidir cuál de esas versiones va a utilizar.
- Desventaja es que las herramientas y configuración para implementar es bastante más complicada y nos toca entender las implicaciones a realizar.

**Nota:** En la mayoría de los proyectos que implementan microfrontend, se inclinan por este método porque brinda una flexibilidad que permite construir integraciones entre nuestras micro-aplicaciones como nos guste.

### Integración en el servidor (Server Integration)

Mientras se envía el JS para cargar el contenedor, el servidor decide si incluye o no el código fuente de nuestros microfrontends (Lista de restaurantes, lista de productos y al carrito de compra).

En el desarrollo frontend, renderizar HTML en el servidor a partir de múltiples plantillas es algo novedoso, así que podemos tener nuestro archivo index.html que tiene elementos comunes, pero también se utiliza las inclusiones del lado del servidor para conectar el contenido especifico de cierta pagina desde fragmentos de archivos html.

Ese archivo html lo puedes publicar con un servidor web/proxy y configurar las paginas de forma variable para que cuando el cliente ingrese a cierta ruta la hagas coincidir con la URL. A esto lo puedes llamar microfrontend porque has dividido el código de cierta forma que, cada pieza representa un concepto de dominio independiente. Debemos lograr que cada archivo HTML termine en el servidor web, para que cada uno tenga su propia canalización de implementación y así, se puedan realizar cambios en una pagina sin afectar las otras.

#### Ventajas y Desventajas

- La ventaja es que puedes tener una mayor independencia, se pueden tener servidores separados para servir cada microfrontend y con otro servidor que realiza solicitudes a los anteriores.
- La desventaja es que requiere una tonelada de código y cierta complejidad para implementar.
- Otra desventaja es, que debemos tener cuidado en las decisiones de diseño porque pueden afectar la independencia de cada código fuente y servidores.

## Código del ejemplo a construir

Habiendo explicado las diferentes categorías de integraciones, vamos a centrarnos en un ejemplo utilizando integración en tiempo de ejecución. Este ejemplo lo vamos a realizar muy vanilla.js pero utilizando el paquete de módulos webpack y su federación de módulos **(Module Federation)**.

Voy con esta categoría porque, como les mencione, es la solución que nos brinda más flexibilidad y es la que casi siempre se inclinan a utilizar hasta el momento. Es cierto que es difícil su configuración y entendimiento, pero pienso que es la solución más eficiente que existe en este momento. Quiero resaltar que, para tener mayor comprensión del ejemplo, debes tener, como mínimo, conocimientos básicos sobre webpack, porque no me voy a centrar en explicar todo el archivo de configuración sino en lo que sienta que es necesario resaltar y explicar.

**_El repositorio lo puedes consultar [aquí](https://github.com/corteshvictor/microfrontend) para clonarlo si no quieres hacerlo manualmente._**

Vamos a crear una carpeta separada, para cada uno de nuestros diferentes microfrontend, uno para el contenedor, otro la para la lista de restaurantes, para la lista de productos y por último para nuestro carrito de compras.

#### Estructura del proyecto

![estructura del proyecto](https://github.com/corteshvictor/microfrontend/blob/main/img/folder.png?raw=true)

Cada una de estas carpetas va a tener todo el código necesario para implementar el proyecto y conseguir que se ejecute de forma aislada. Van a tener un archivo indice para nuestra aplicación, un archivo HTML para visualizar el contenido, un package.json para la lista de nuestras dependencias de cada subproducto o microfrontend y finalmente, un archivo de configuración de webpack. Vamos a realizar el ejército muy vanilla y con datos falsos.

**Nota:** Como dije antes, no voy a explicar muchas cosas del código, ya que para este articulo, lo ideal, es que tengas conocimientos básicos de html, javascript y webpack. Voy a enfocarme en lo que considere importante. Adicional estoy utilizando la versión 14 de node.js, recomiendo utilizar esta misma versión o desde la 12 en adelante.

Con NPM puedes instalar los siguientes paquetes y las versiones especificas que fueron utilizadas al momento de construir el ejercicio.

```
html-webpack-plugin@5.3.1
webpack@5.35.1
webpack-cli@4.6.0
webpack-dev-server@3.11.2
```

A continuación, vamos a ir colocando los fragmentos de código para cada microfrontend y por último nos vamos a enfocar explicando lo más importante a resaltar y la configuración de webpack.

#### Lista de Restaurantes

- index.html

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Administrar los restaurantes</title>
  </head>
  <body>
    <div id="app-restaurants"></div>
  </body>
</html>
```

- index.js

```javascript
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
```

- webpack.config.js

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 8081,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "restaurants",
      filename: "remoteEntry.js",
      exposes: {
        "./RestaurantsMain": "./src/index",
      },
    }),
  ],
};
```

#### Lista de Productos

- index.html

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Administrar los productos</title>
  </head>
  <body>
    <div id="app-products"></div>
  </body>
</html>
```

- index.js

```javascript
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
```

- webpack.config.js

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 8082,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsMain": "./src/index",
      },
    }),
  ],
};
```

#### Carrito de Compras

- index.html

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Carrito de Compras</title>
  </head>
  <body>
    <div id="app-cart"></div>
  </body>
</html>
```

- index.js

```javascript
const textContent = `<h2>Microfrontend - carrito de compras</h2>
<p>Tienes <strong>${Math.round(
  Math.random() * 5
)}</strong> artículos en su carrito de compras</p>`;

document.getElementById("app-cart").innerHTML = textContent;
```

- webpack.config.js

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 8083,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "cart",
      filename: "remoteEntry.js",
      exposes: {
        "./CartMain": "./src/index",
      },
    }),
  ],
};
```

#### Contenedor

- index.html

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Buy Food</title>
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body>
    <div id="app-container">
      <section id="app-restaurants"></section>
      <section id="app-products"></section>
      <section id="app-cart"></section>
    </div>
  </body>
</html>
```

- index.js

```javascript
import("./bootstrap");
```

- bootstrap.js

```javascript
import "products/ProductsMain";
import "cart/CartMain";
import "restaurants/RestaurantsMain";

console.log("Lógica del container");
```

- webpack.config.js

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        products: "products@http://localhost:8082/remoteEntry.js",
        cart: "cart@http://localhost:8083/remoteEntry.js",
        restaurants: "restaurants@http://localhost:8081/remoteEntry.js",
      },
    }),
  ],
};
```

- main.css

```css
#app-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(3, 1fr);
  gap: 5em;
  margin: 3em;
}

#app-container > section {
  border: 1px solid;
  padding: 0 2em;
}
```
