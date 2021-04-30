# Microfrontends

En este artículo vamos a tratar el lado técnico de los microfrontend, lo primero que vamos a cubrir es, exactamente lo que es un microfrontend y obviamente, una parte muy importante, la comprensión de lo que son y cómo usarlos.

Para entender realmente los microfrontends, primero quiero que imaginen que estamos construyendo una aplicación de comercio electrónico donde los clientes pueden pedir diferentes tipos de comidas a diferentes restaurantes.

- [Aplicación de comercio electrónico](#aplicación-de-comercio-electrónico)
- [Beneficios](#beneficios)
- [Resumen](#resumen)
- [Ejemplo a construir](#ejemplo-a-construir)
- [Categorías de Integración](#categorías-de-integración)
  - [Integración en tiempo de construcción (Build-Time Integration)](#integración-en-tiempo-de-construcción-build-time-integration)
  - [Integración en tiempo de ejecución (Run-Time Integration)](#integración-en-tiempo-de-ejecución-run-time-integration)
  - [Integración en el servidor (Server Integration)](#integración-en-el-servidor-server-integration)
- [Código del ejemplo a construir](#código-del-ejemplo-a-construir)
  - [Lista de Restaurantes](#lista-de-restaurantes)
  - [Host o Contenedor](#host-o-contenedor)
  - [Lista de Productos](#lista-de-productos)
  - [Carrito de Compras](#carrito-de-compras)
- [Posibles errores](#posibles-errores)
  - [Cuando el atributo id del html es igual al nombre de nuestra aplicación remota en el contenedor](#cuando-el-atributo-id-del-html-es-igual-al-nombre-de-nuestra-aplicación-remota-en-el-contenedor)
  - [Cuando quieres utilizar un import normal y no un import de función](#cuando-quieres-utilizar-un-import-normal-y-no-un-import-de-función)
  - [Cuando el nombre del proyecto remoto no coincide con el contenedor](#cuando-el-nombre-del-proyecto-remoto-no-coincide-con-el-contenedor)
  - [Cuando el import de un módulo no coincide con la propiedad remota del ModuleFederetionPlugin](#cuando-el-import-de-un-módulo-no-coincide-con-la-propiedad-remota-del-modulefederetionplugin)
  - [Cuando el import de un módulo no coincide con el alias del proyecto remoto](#cuando-el-import-de-un-módulo-no-coincide-con-el-alias-del-proyecto-remoto)
- [Compartir dependencias entre diferentes subproyectos](#compartir-dependencias-entre-diferentes-subproyectos)

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
- la página del carrito de la compra.

Después de identificar cada una de estas características principales, podemos dividir cada sección en su propia base de código para que estén separadas, por lo que podríamos tener todo el código para nuestro listado de restaurantes dentro de una SPA utilizando cualquier framework o librería mencionada anteriormente. A su vez, podríamos tener todo el código de nuestro listado de productos dentro de otra SPA y también podemos tener todo el código de nuestro carrito de compra dentro de una aplicación totalmente separada a las otras dos.

Apenas empezamos a dividir estas tres bases de código, vamos a encontrarnos con muchas cuestiones interesantes. Por ejemplo, si el usuario hace clic en el producto para añadirlo al carrito, claramente tenemos la necesidad de añadir este producto a la página del carrito de compras.

Dentro de un enfoque microfrontend, tanto como sea posible, tratamos de evitar la comunicación directa entre los proyectos, no hacer la adición de un producto directamente a la pagina del carrito de compras.

![No comunicar las aplicaciones](https://github.com/corteshvictor/microfrontend/blob/main/img/img_2.png?raw=true)

En su lugar, tendríamos que cada aplicación, realizar la comunicación entre las aplicaciones por medio del enrutamiento, desde una interfaz pasar los datos o algún tipo de solicitud a una API que gestiona todos los datos dentro de cada aplicación, dependiendo de la necesidad, puedes tomar otra vía, pero para el articulo y representemos la petición a una API.

![Peticiones a las API de cada App](https://github.com/corteshvictor/microfrontend/blob/main/img/img_3.png?raw=true)

Cada vez que un usuario cargue la aplicación del carro de compras para ver los productos que ha añadido a su carro, la aplicación del carro de compras haría una petición a esa misma API y obtendría un listado de todos los productos que hay en su carro. De esta forma puedes notar que no tenemos ningún tipo de comunicación directas entre las tres aplicaciones.

## Beneficios

Ahora te puedes preguntar, ¿Por qué usaríamos microfrontend, qué beneficio obtenemos al dividir estas características en aplicaciones separadas?

Hay un beneficio gigantesco que obtenemos, y es que cada una de estas aplicaciones puede ser considerada como aplicaciones independientes, totalmente separadas.

- No existe comunicación directa entre ellas.
- No hay dependencia directa entre ellas.

Lo que significa que podemos asignar la implementación del listado de restaurantes a un equipo de desarrollado No. 1, podemos asignar la aplicación del listado de productos a un equipo de desarrollo No. 2 y por último asignar la característica del carrito de compras a un equipo de desarrollo No. 3 totalmente diferentes a los otros equipos.
![App con equipos diferentes](https://github.com/corteshvictor/microfrontend/blob/main/img/img_4.png?raw=true)

Estos pueden ser tres equipos de desarrollo o ingeniería totalmente diferentes dentro de la empresa, hasta puedes utilizar un outsourcing para que construya cierta característica. Con esto, los equipos pueden decidir qué hacer, tomar decisiones técnicas totalmente diferentes para implementar cada uno de estos proyectos.

#### Por ejemplo.

El equipo de desarrollo No. 1, puede decidir implementar React, el No. 2 se decide por Vue, mientras que el equipo de desarrollo No. 3 puede implementar Svelte. Obviamente queremos limitar el numero de framework y librarías que se utilizan en la empresa. Pero el punto aquí es, que cada equipo de desarrollo o ingeniería puede construir su aplicación con su propio estilo o stack de desarrollo preferido, lo que crean que funciona mejor para ellos.

## Resumen

Vamos a resumir lo que hemos hablado hasta el momento para centrar las ideas y tener el concepto un poco mas claro.
Los microfrontend es donde tomamos una aplicación monolítica y la dividimos en múltiples aplicaciones más pequeñas, cada una de estas aplicaciones más pequeñas son responsables de una característica principal distinta de nuestro producto tanto como sea posible. Intentamos evitar que estas diferentes micro-aplicaciones se comuniquen entre sí directamente.

Hacemos uso de microfrontend porque permite que varios equipos de desarrollo trabajen en la misma aplicación global, pero en total aislamiento. Así, el equipo No. 1 puede realizar cambios sin que estos rompan las otras secciones o características de la aplicación, pueden manejar las dependencias de su proyecto totalmente diferente a la de los otros equipos. Además, cuando empezamos a dividir nuestra aplicación en microfrontend, hace que cada una de estas partes más pequeñas sea mucho más fácil de entender y puedes hacer cambios sin romper accidentalmente alguna otra parte de nuestra aplicación global.

- **_¿Qué son los microfrontend?_**
  - Dividir una aplicación monolítica en varias aplicaciones más pequeñas.
  - Cada aplicación más pequeña es responsable de una característica distinta del producto.
- **_¿Por qué utilizarlos?_**
  - Varios equipos de desarrollo pueden trabajar de forma aislada.
  - Cada aplicación más pequeña es más fácil de entender y de realizar cambios.

## Ejemplo a construir

El siguiente ejemplo, vamos a construir nuestra aplicación, para tener una mejor idea de cómo funciona todo lo de microfrontend. se va a realizar una aplicación muy simple, sencilla que no va a utilizar ningún framework o librería dentro de ella.

Esta aplicación simula la compra de comida de diferentes restaurantes, listaremos las secciones para tener algunos restaurantes, productos a la venta y el número de artículos que tiene en el carro de compra.

**Nota:** Quiero dejar muy claro que, estamos trabajando con datos 100% falsos. No se va a utilizar API ni nada por el estilo, tampoco vamos a tener interacción, por ende, no tenemos ninguna adición real de artículos a un carro de compras, ni nada por el estilo. En realidad, sólo estamos intentado que aparezca textos planos en la pantalla cuando se ejecute la aplicación.

En primer lugar, tenemos un listado de diferentes restaurantes que están disponibles para seleccionar. También tenemos una lista de diferentes productos que están disponibles para la venta. Por último, tenemos una pagina del carrito de compras, que va a mostrar el número de artículos que un usuario tiene en su carrito. Recordemos que toda esta información es texto plano, este número es un valor generado al azar que vamos a pegar en el código.

Con lo planteado anteriormente, nos dimos cuenta de inmediato que tenemos tres características distintas, podríamos decir que, en una aplicación monolítica, podemos tener un componente global de la aplicación, que tenga un componente para la lista de restaurantes, otro para la lista de artículos y un componente para el carro de compras.
![Solución sin microfrontend](https://github.com/corteshvictor/microfrontend/blob/main/img/img_5.png?raw=true)

#### ¿Cómo enfocaríamos esto si estuviéramos haciendo uso de microfrontend?

Podemos decidir tomar cada característica o sección importante de nuestro producto y ponerlo en una aplicación microfrontend diferente para que consiguiésemos tener micro-aplicaciones y no una sola aplicación que contiene todo el código relacionado con nuestras características planteadas.

Entonces, lo que queremos es, crear una aplicación que solo contenga el código necesario para obtener el listado de nuestros restaurantes y mostrarlos en pantalla, otra aplicación para obtener el listado de los productos y visualizarlo en la página y una tercera aplicación microfrontend que contenga todo el código necesario para conseguir que el carrito muestre su información.
![Solución con microfrontend](https://github.com/corteshvictor/microfrontend/blob/main/img/img_6.png?raw=true)

Ahora bien, ya podemos darnos cuenta de que, si solo tenemos estos tres microfrontends, podemos tener un reto bastante significante para conseguir que estas cosas se muestren en nuestra pagina o pantalla. En otras palabras, ¿cómo sabemos que el _MFE No. 1_ necesita ser mostrado en la parte de arriba de nuestra pagina, que el _MFE No. 2_ tiene que estar ubicado en el centro y que el _MFE No. 3_ tiene que ser mostrado en la parte inferior?

Para dar solución, muy a menudo acabamos creando una cuarta aplicación microfronted a lo que llamamos o solemos referirnos como el Contenedor **(Container)**. El contenedor es el que decide cuándo y dónde mostrar todos los diferentes microfronted que tenemos.
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

Tenemos un equipo desarrollando nuestra aplicación para la **lista de restaurantes**, cuando este equipo termina el proyecto, informan que están listos para desplegar la aplicación. En este momento, el equipo de administrar los restaurantes publicaría la lista de restaurantes como un paquete de NPM para que este disponible y pueda ser instalado en cualquier proyecto.

Ya después de librado el paquete, el equipo encargado del **Contenedor**, instala este paquete como una dependencia del proyecto y el equipo comienza a construir su aplicación contenedora. El resultado final, sería un proyecto que tiene todo el código fuente del contenedor y todo el código fuente de nuestra lista de restaurantes.

#### Ventas y desventajas de este enfoque:

- La Ventaja es que, es realmente fácil de configurar este flujo y es relativamente fácil de entender también. porque se produce un único paquete JavaScript público que nos permite duplicar dependencias comunes de nuestras diversas aplicaciones. Este es un flujo muy común y seguro, ya lo has implementado, pero de pronto no eras consciente que estabas realizando una integración en tiempo de compilación.
- La desventaja de este enfoque es que, cada vez que la aplicación de la lista de restaurantes necesita ser redistribuida, tendríamos que volver a desplegar el contenedor también. Nos tocaría que volver a compilar y lanzar cada micro-aplicación para publicar un cambio en cualquier parte individual del producto, actualizar las dependencias y desplegar el contenedor.
- Otra desventaja es que, el contenedor tiene acceso completo a todas nuestras micro-aplicaciones y eso puede ser muy tentador de querer acoplar las aplicaciones y esto es algo que debemos evitar en una arquitectura de microfrontend.

### Integración en tiempo de ejecución (Run-Time Integration)

Es conocido también como, integración del lado del cliente (Client-Side Integration). Cuando hablamos de esta categoría, tenemos que entender que después de que el contenedor se cargue en el navegador, es que va a tener acceso al código fuente de nuestra lista de restaurante.

De nuevo resalto que existen diferentes métodos para implementar esto, pero quiero dar un ejemplo que sea una manera fácil de comprender una integración en tiempo de ejecución.

Nuevamente, tenemos un equipo desarrollando nuestra aplicación de **lista de restaurantes**, dicen que es el momento de desplegar, en ese punto, en lugar de desplegar el proyecto a un sistema de gestión de paquetes, el equipo despliega su aplicación en un enlace **URL**, algo como, https://www.mi-app-ventasdecomida.com/lista-de-restaurantes.js, este archivo de JavaScript tiene todo el código necesario de la aplicación.

El **contenedor** es liberado en la dirección raíz, https://www.mi-app-ventasdecomida.com y en ese momento que un cliente ingrese a ese enlace raíz, el contenedor se carga y obtendría el enlace de nuestra lista de restaurantes, es decir, carga el archivo JavaScript. En este enfoque, el contenedor sólo tiene acceso al código de nuestra micro-aplicación después de que el contenedor haya cargado en el navegador.

#### Ventajas y desventajas.

- La ventaja es que podemos desplegar independientemente nuestra micro-aplicación sin tener que depender o desplegar el contenedor. Cada proyecto se despliega cuando se considere necesario.
- Otra ventaja es que podemos tener fácilmente diferentes versiones en vivo de la aplicación de la lista de restaurantes. Podemos estar realizando pruebas de diferentes versiones de la lista de restaurantes y el contenedor decidir cuál de esas versiones va a utilizar.
- Desventaja es que las herramientas y configuración para implementar es bastante más complicada y nos toca entender las implicaciones a realizar.

**Nota:** En la mayoría de los proyectos que implementan microfrontend, se inclinan por este método porque brinda una flexibilidad que permite construir integraciones entre nuestras micro-aplicaciones como nos guste.

### Integración en el servidor (Server Integration)

Mientras se envía el JS para cargar el contenedor, el servidor decide si incluye o no el código fuente de nuestros microfrontends (Lista de restaurantes, lista de productos y al carrito de compra).

En el desarrollo frontend, renderizar HTML en el servidor a partir de múltiples plantillas es algo novedoso, así que podemos tener nuestro archivo index.html que tiene elementos comunes, pero también se utiliza las inclusiones del lado del servidor para conectar el contenido especifico de cierta pagina desde fragmentos de archivos html.

Ese archivo html lo puedes publicar con un servidor web/proxy y configurar las paginas de forma variable para que cuando el cliente ingrese a cierta ruta la hagas coincidir con la URL. A esto lo puedes llamar microfrontend porque has dividido el código de cierta forma, que cada pieza representa un concepto de dominio independiente. Debemos lograr que cada archivo HTML termine en el servidor web, para que cada uno tenga su propia canalización de implementación y así, se puedan realizar cambios en una pagina sin afectar las otras.

#### Ventajas y Desventajas

- La ventaja es que puedes tener una mayor independencia, se pueden tener servidores separados para servir cada microfrontend y con otro servidor que realiza solicitudes a los anteriores.
- La desventaja es que requiere una tonelada de código y cierta complejidad para implementar.
- Otra desventaja es, que debemos tener cuidado en las decisiones de diseño porque pueden afectar la independencia de cada código fuente y servidores.

## Código del ejemplo a construir

Habiendo explicado las diferentes categorías de integraciones, vamos a centrarnos en un ejemplo utilizando integración en tiempo de ejecución. Este ejemplo lo vamos a realizar muy vanilla.js pero utilizando el paquete de módulos webpack y su federación de módulos **(Module Federation)**.

Voy con esta categoría porque, como les mencione, es la solución que nos brinda más flexibilidad y es la que casi siempre se inclinan a utilizar hasta el momento. Es cierto que es difícil su configuración y entendimiento, pero pienso que es la solución más eficiente que existe en este momento. Quiero resaltar que, para tener mayor comprensión del ejemplo, debes tener, como mínimo, conocimientos básicos sobre webpack, porque no me voy a centrar en explicar todo el archivo de configuración sino en lo que sienta que es necesario resaltar y explicar.

**_El repositorio lo puedes consultar [aquí](https://github.com/corteshvictor/microfrontend) para clonarlo si no quieres hacerlo manualmente._**

Vamos a crear una carpeta separada, para cada uno de nuestros diferentes microfrontend, uno para el contenedor, otro para la lista de restaurantes, el de la lista de productos y por último para nuestro carrito de compras.

#### Estructura del proyecto

![](https://github.com/corteshvictor/microfrontend/blob/main/img/folder.png?raw=true)
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

Del archivo `index.html`, quiero resaltar esta línea de código `<div id='app-restaurants'></div>` porque es aquí donde vamos a renderizar nuestro proyecto para listar los restaurantes. Adicionalmente, la descripción del atributo `id` tiene que ser diferente al nombre de nuestro componente remoto, es decir, al nombre declarado en el objeto del module federation de webpack en la lista de restaurantes.

```javascript
new ModuleFederationPlugin({
  name: "restaurants",
});
```

**Nota**: A nivel de ejecutar el proyecto independiente, no tienes problema en renderizar si el id es igual al nombre, este te renderiza sin problema cuando se ejecuta la aplicación de forma individual, el punto grave, es cuando quieres renderizar en el contenedor para correr todas las aplicaciones. Por eso resalto que es importante que sea diferente. Estaré resaltado un poco esta parte en la sección de [Posibles errores](#posibles-errores) que puedes tener si ese id es igual a `restaurants`

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

Del archivo `index.js`, este fragmento de código

```javascript
document.getElementById("app-restaurants").innerHTML = htmlRestaurants;
```

es el que inserta nuestro HTML dentro de la división que mencionamos en el archivo `index.html` para agrupar todo el contenido.

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

De Webpack, primero quiero resaltar la Federación de Módulos o Module Federation, que nos permite tener varias compilaciones independientes para formar una sola aplicación. Estas compilaciones separadas no deben tener dependencias entre sí, por lo que pueden desarrollarse e implementarse individualmente.

Del archivo `webpack.config.js` al requerir ModuleFederationPlugin

```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
```

nos permite exponer y utilizar cualquier tipo de módulo compatible con Webpack. Crea una entrada de contenedor adicional con los módulos expuestos especificados y agrega referencias especificas a contenedores como externos y permite importar módulos remotos desde estos contenedores.

El siguiente fragmento de código es el que utiliza el plugin federación de módulos, En el objeto, para este ejercicio, estamos armando un objeto con las propiedades `name`, `filename` y `exposes`.

```javascript
new ModuleFederationPlugin({
  name: "restaurants",
  filename: "remoteEntry.js",
  exposes: {
    "./RestaurantsMain": "./src/index",
  },
});
```

- **Name:** Es el nombre de nuestra aplicación remota. quiero resaltar que este nombre debe ser igual al valor `restaurants` que esta antes del `@` de la URL donde se busca la aplicación remota de restaurants en el contenedor. Mas adelante resaltamos esta parte.
- **filename:** Establece el nombre del archivo manifiesto (manifest). Por convención se declara con el nombre `remoteEntry.js` pero lo puedes nombrar como quieras, mi recomendación utiliza remoteEntry a menos que tengas una buena razón para cambiarlo.
- **exposes:** Es un objeto con todos los alias de los nombres de los archivos que quieres exponer para que tu Host o Contenedor lo pueda obtener. Pueden notar que esta accediendo al archivo `index.js` dentro de la carpeta `src` y a esta ruta le da un alias con el nombre de `RestaurantsMain`, este alias es utilizado por el contenedor para encontrar el archivo, si no están iguales se presenta un error. Puedes ver la falla [Cuando el import de un módulo no coincide con el alias del proyecto remoto](#cuando-el-import-de-un-módulo-no-coincide-con-el-alias-del-proyecto-remoto)

**Nota:** Para la lista de productos y carrito de compra, el código prácticamente es muy parecido al de la lista de restaurantes, así que no veo necesario resaltar los códigos importantes, son los mismos fragmentos de restaurantes.

#### Host o Contenedor

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

Del archivo `index.html` de nuestro contenedor, resalto estas tres secciones

```html
<section id="app-restaurants"></section>
<section id="app-products"></section>
<section id="app-cart"></section>
```

Que son donde se van a renderizar nuestras tres aplicaciones remotas en la posición que nosotros le queramos dar, adicional el atributo id debe ser igual al selector utilizado en los archivos `index.js` y como mencione anteriormente, estos id deben ser diferente a los nombres de nuestras aplicaciones remotas expuestas en el archivo `webpack.config.js`. Puedes ver la explicación de este error _[Cuando el atributo id del html es igual al nombre de nuestra aplicación remota en el contenedor](#cuando-el-atributo-id-del-html-es-igual-al-nombre-de-nuestra-aplicación-remota-en-el-contenedor)_

- index.js

```javascript
import("./bootstrap");
```

Esta linea de código, lo único que estamos haciendo es importar el archivo `bootstrap.js`. Pero resalto que estamos utilizando una sintaxis diferente para la importación, que es una llamada a la función de importación, esto permite que Webpack tenga la oportunidad dentro del navegador de ir y obtener algunas dependencias antes de ejecutar el código de `bootstrap.js`.

- bootstrap.js

```javascript
import "restaurants/RestaurantsMain";
import "products/ProductsMain";
import "cart/CartMain";

console.log("Lógica del container");
```

Los tres import son importaciones de los módulos o nuestras micro-aplicaciones. Por eso la importancia del archivo `index.js` porque es el que permite que tengamos accesos a estos módulos y a todas las diferentes dependencias que requiere.

Estos imports tiene una particularidad en su estructura, por ejemplo `import "restaurants/RestaurantsMain"` la fracción `restaurants` representa nuestro módulo remoto, que este texto debe coincidir con la propiedad del objeto `remotes` del contenedor. (Este objeto remotes lo puedes encontrar en el archivo `webpack.config.js`).

El otro fragmento `RestaurantsMain` es el alias del archivo expuesto en nuestro microfrontend, para este caso nuestro proyecto para listar restaurantes, en su archivo `webpack.config.js` podemos observar que este alias esta expuesto para que pueda ser utilizado. Error generado [Cuando el import de un módulo no coincide con el alias del proyecto remoto](#cuando-el-import-de-un-módulo-no-coincide-con-el-alias-del-proyecto-remoto)

**Nota:** Si intentamos ir directamente a nuestro archivo `bootstrap.js` sin pasar por el `index.js`, en otras palabras, sí intentamos ejecutar esos import de primero, terminaremos con un error. Nos mostraría algún mensaje diciendo que no tenemos ningún código para esos módulos de restaurantes, productos y carrito de compras. _Puedes consultar el error que se genera [Cuando quieres utilizar un import normal y no un import de función](#cuando-quieres-utilizar-un-import-normal-y-no-un-import-de-función)_

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

El siguiente fragmento de código es el que utiliza el plugin federación de módulos, en los parámetros nombrados, para este ejercicio, estamos armando un objeto con las propiedades `name`, `remotes` y dentro de remotes `products`, `cart`, `restaurants`.

```javascript
new ModuleFederationPlugin({
      name: "container",
      remotes: {
	    restaurants: "restaurants@http://localhost:8081/remoteEntry.js",
        products: "products@http://localhost:8082/remoteEntry.js",
        cart: "cart@http://localhost:8083/remoteEntry.js",
      },
    }),
```

- **Name:** Es el nombre de nuestro Host o Contenedor. quiero resaltar que este nombre lo puedes omitir, no es necesario colocarlo, pero por convección es bueno manejar el nombre y sepas que esta configuración pertenece a tu Host, Contenedor o el orquestador de los microfrontend. En pocas palabras, no se utiliza, se añade para mayor claridad.
- **remotes:** Es un objeto que enumera los proyectos que él Contenedor puede buscar para obtener código adicional o el código de nuestras micro-aplicaciones, por eso este objeto tiene las propiedades `restaurants`, `products` y `cart` y cada una tiene como valor la relación con la propiedad `name` en el archivo `webpack.config.js` de cada microfronted, seguido por un `@` para después indicar la URL del archivo `remoteEntry.js`
- En `webpack.config.js` de nuestro restaurante, tenemos `name: "restaurants"` donde este nombre es igual al valor de la propiedad `restaurnats` del objeto remotes `restaurants@...`, Las cadenas tienen que ser idénticas, tiene que coincidir. Puedes consultar el error que se genera [Cuando el nombre del proyecto remoto no coincide con el contenedor](#cuando-el-nombre-del-proyecto-remoto-no-coincide-con-el-contenedor)

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

@media (max-width: 900px) {
  #app-container {
    grid-template-columns: 1fr;
    gap: 3em;
  }
}
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

Sí ejecutas cada proyecto y al abrir el navegador para ingresar a la dirección http://localhost:8080 podemos notar que la aplicación se ve parecida a la siguiente imagen después de aplicar los estilos.

![Vista final de la aplicación](https://github.com/corteshvictor/microfrontend/blob/main/img/AppFinal.png?raw=true)

## Posibles errores

A continuación vamos a resaltar los errores mas comunes o típicos que podemos tener y en la mayoría de los casos pueden ser difíciles de detectar.

### Cuando el atributo id del html es igual al nombre de nuestra aplicación remota en el contenedor

![Error cuando el id es igual al nombre](https://github.com/corteshvictor/microfrontend/blob/main/img/fnError.png?raw=true)

Sólo quiero contarte un poco más sobre este pequeño error, que puedes encontrar y que es difícil de solucionar. Así que en primer lugar, en las herramientas de desarrollo de mi navegador, voy a abrir mi pestaña de Network y vamos a mirar el archivo `remoteEntry.js` que viene de http://localhost:8081/remoteEntry.js, que es nuestra aplicación para listar los restaurantes.

![Respuesta archivo remoteEntry.js](https://github.com/corteshvictor/microfrontend/blob/main/img/remoteEntryJS.png?raw=true)

Y si damos un vistazo a la respuesta, quiero que noten algo, en nuestra línea 9 usted ve que dice `var restaurants;`, se esta declarando una variable y luego asigna un valor a esa variable y el valor que asigna es básicamente el resultado de todas estas cosas de Webpack para acceder al código de nuestro restaurante.

Cada vez que nuestro navegador carga ese archivo de `remoteEntry.js`, va a buscará una variable `restaurants` dentro de él y tratará de acceder a esa variable para obtener toda la información contenida dentro del archivo `remoteEntry.js`. Así que esta variable del restaurante está siendo establecida en el contenedor y cuando nuestro contenedor está tratando de acceder a remoteEntry.js, va a tratar de buscar una variable llamada `restaurants`.

Esta variable de `restaurants` está siendo creada por nuestro archivo `remoteEntry.js` qué viene de nuestra aplicación del restaurante. `var restaurants` está siendo declarada como una variable global por lo que podemos imprimirla fácilmente en nuestra consola. En la imagen podemos notar que `restaurants` es un objeto que tiene funciones para interactuar con el código que viene del archivo `remoteEntry.js`.

Así que esencialmente, tenemos un objeto aquí que nos permite acceder a todo el código que estamos buscando para cargar en nuestro contenedor.

![Se muestra en la consola la variable restaurants](https://github.com/corteshvictor/microfrontend/blob/main/img/fnError_2.png?raw=true)

Si se nos presenta el error `fn is not a function` intenta imprimir `restaurants` como en la imagen, esa variable global, ya no trae el objeto con funciones, en su lugar obtenemos una referencia a ese elemento HTML, en nuestro caso al `section`. Así que este es el error, es algo muy engañoso.

Esto pasa porque al asignar una id a un elemento HTML, tu navegador va a intentar crear una nueva variable global con el mismo nombre exacto que ese id. Como el id de ese elemento se llama restaurants, tu navegador va a tratar de crear una variable global llamada `restaurants`, esa variable global va a sobrescribir la variable global actual, que se define dentro de `remoteEntry.js` y cuando el navegador intenta acceder a `restaurants`, en lugar de obtener nuestro código procedente de la aplicación, en su lugar obtiene un elemento HTML, por este motivo terminamos con este mensaje de error `fn is not a function.`

Es un error bastante raro, pero debemos tener claro y entender que él id de un elemento HTML va a ser asignado como una variable global y que `remoteEntry.js` que viene de nuestra aplicación de listar restaurantes va a tratar de declarar una variable global también. Por ende, las dos van a entrar en conflicto. Así que para arreglar esto, todo lo que tenemos que hacer es, asegurarnos de que no tenemos algún elemento dentro de nuestro proyecto con un id igual a lo que viene dentro de ese archivo `remoteEntry.js`. En otras palabras, no queremos tener un id con el mismo nombre de nuestra aplicación remota.

### Cuando quieres utilizar un import normal y no un import de función

![Error cuando utilizas un import normal](https://github.com/corteshvictor/microfrontend/blob/main/img/errorImport.png?raw=true)

Al utilizar un import normal, vemos que se genera un error por eso tienes que utilizar la función de importación `import("./bootstrap")`, porque permite que Webpack tenga la oportunidad, dentro del navegador de ir y obtener algunas dependencias antes de ejecutar el código de `bootstrap.js`. es decir, de darse cuenta de que antes de ejecutar ese archivo `bootstrap.js`, tenemos que ir a buscar los códigos de nuestras micro-aplicaciones.

Este es el objetivo del archivo `index.js` con la función de importación, es solo para permitir que Webpack tenga la ocasión de obtener JavaScript adicional y asegurarse que tenemos el código del proyecto listo.

### Cuando el nombre del proyecto remoto no coincide con el contenedor

![Error cuando el nombre no es igual](https://github.com/corteshvictor/microfrontend/blob/main/img/errorNombreRemoto.png?raw=true)

Como vemos en la imagen, si el nombre que establecimos en nuestro proyecto de lista de restaurantes es diferente al valor de la propiedad restaurants que se utiliza para concadenar con la URL de nuestro remoteEntry, se genera un error por falla en la carga del script. Así que, tener la precaución que estos archivos coincidan con los nombres.

### Cuando el import de un módulo no coincide con la propiedad remota del ModuleFederetionPlugin

![Error cuando no es igual el módulo con el import](https://github.com/corteshvictor/microfrontend/blob/main/img/errorContenedor_1.png?raw=true)

Cuando el import intenta llamar al módulo restaurants `import "restaurants/RestaurantsMain"`, este lo busca en los módulos y como no esta, va a nuestra configuración del contenedor para obtener ese módulo de los remotos del ModuleFederationPlugin, pero, como visualizamos en la imagen, la propiedad del remoto es diferente a restaurants utilizado en el import, por eso muestra o se genera el error. Tener cuidado que estos archivos coincidan con el nombre.

### Cuando el import de un módulo no coincide con el alias del proyecto remoto

![Error cuando el alias no es igual](https://github.com/corteshvictor/microfrontend/blob/main/img/errorAlias.png?raw=true)

El Alias de los nombres de los archivos expuestos, debe coincidir con los importados en el contenedor, para que no se genere el error como lo indica la imagen.

## Compartir dependencias entre diferentes subproyectos

No voy a colocar ejemplo de esto, pero voy a mencionar de forma muy rápida de como hacerlo.

Si tienes la misma dependencia en los diferentes microfronted, el contenedor las va a importar cuantas veces sea necesaria, esto es un problema, si la dependencia es algo pesada, entonces este archivo JavaScript se va a cargar tantas veces este repetida la dependencia en los proyectos.

Para compartir la dependencia, tendrías que ir a cada micro-proyecto y en nuestro ModuleFederationPlugin vamos a utilizar la propiedad `shared`

```javascript
new ModuleFederationPlugin({
      name: "restaurants",
      filename: "remoteEntry.js",
      exposes: {
        "./RestaurantsMain": "./src/index",
      },
      shared:['Dependencia a compartir']
    }),
```

```javascript
new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsMain": "./src/index",
      },
      shared:['Dependencia a compartir']
    }),
```

Imagina que nuestros archivos `index.js` tiene al principio algo como

```javascript
import MiDependencia from "MiDependencia";
```

y nosotros solo configuramos esto`shared:['MiDependencia']`, vamos a tener un problema, porque no solo es este cambio que debes contemplar, porque si solo haces esto, se genera un error diciendo que el módulo compartido no está disponible para el consumo de los usuarios. `Error Shared module is not available for eager consumption`

Entonces, recordar que cuando cargamos productos de forma aislada, el primer archivo que realmente se ejecuta es nuestro `index.js` y dentro de aquí tenemos un código que dice tener acceso a nuestra dependencia de forma inmediata. Como que instantáneamente queremos que `MiDependencia` esté disponible dentro de este archivo para ser utilizado de forma inmediata. Desafortunadamente, cuando marcamos `MiDependencia` como un módulo compartido, haces que se cargue por defecto de forma asincrónica, así que cuando nuestro archivo `index.js` todavía no tenemos `MiDependencia` disponible.

Entonces, para solucionar ese error, usas el mismo patron que utilizamos en el contenedor, nuestro famoso `bootstrap.js`, mueves el código del `index.js` dentro de `bootstrap.js` y en `index.js` realizar una función de importación `import('./bootstrap.js')`. Recuerda que cuando utilizamos ese import en forma de función, se cargará el archivo de forma asincrónica. Cargar el archivo asíncrono recordemos que le damos a Webpack la oportunidad de ver qué archivo requiere el código de bootstrap para que se ejecute de forma correcta.

Cuando Webpack tiene esa capacidad de poder analizar lo que necesitas para ejecutar el código, Webpack carga la dependencia sin problema y la va a tener disponible antes de ejecutar cualquier parte del código.

Aquí toca tener presente otras cosas al compartir las dependencias, si manejas diferentes versiones entre los microfrontend, si quieres utilizar `singleton` y cosas como estas creo que es mejor investigar como funcionan.
