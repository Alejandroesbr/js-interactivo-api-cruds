# HUS4 - Gestor de Datos con CRUD y API REST

Aplicacion web de una sola pagina (SPA) que implementa un gestor de elementos con operaciones CRUD completas. La interfaz se comunica con una API REST local levantada con `json-server`, y cuenta con un mecanismo de respaldo en `localStorage` para funcionar sin conexion al servidor.

---

## Indice

- [Descripcion general](#descripcion-general)
- [Tecnologias usadas](#tecnologias-usadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Descripcion de archivos principales](#descripcion-de-archivos-principales)
  - [index.html](#indexhtml)
  - [app.js](#appjs)
  - [db.json](#dbjson)
  - [package.json](#packagejson)
- [Flujo de datos y logica de la aplicacion](#flujo-de-datos-y-logica-de-la-aplicacion)
- [Requisitos previos](#requisitos-previos)
- [Instalacion](#instalacion)
- [Como ejecutar el proyecto](#como-ejecutar-el-proyecto)
- [Uso de la aplicacion](#uso-de-la-aplicacion)
- [Notas adicionales](#notas-adicionales)

---

## Descripcion general

El proyecto permite a un usuario crear, leer, actualizar y eliminar elementos de texto a traves de un formulario HTML. Los datos se persisten en un archivo `db.json` mediante `json-server`, que actua como backend simulado. Si el servidor no esta disponible, la aplicacion cae automaticamente al uso de datos en `localStorage`, garantizando que la interfaz no quede completamente inutilizable.

---

## Tecnologias usadas

| Tecnologia | Version | Rol en el proyecto |
|---|---|---|
| HTML5 | - | Estructura de la pagina |
| JavaScript (ES6+) | - | Logica del cliente, manipulacion del DOM y llamadas a la API |
| Bootstrap | 5.3.8 | Estilos y componentes visuales (cargado via CDN) |
| json-server | ^1.0.0-beta.15 | Servidor REST local que lee y escribe en `db.json` |
| Node.js / npm | >= 14 recomendado | Entorno de ejecucion y gestor de paquetes |
| localStorage | API del navegador | Capa de respaldo offline |
| Fetch API | API del navegador | Comunicacion asincrona con el servidor REST |

---

## Estructura del proyecto

```
HUS4/
├── index.html          # Vista principal de la aplicacion
├── app.js              # Logica JavaScript del lado del cliente
├── db.json             # Base de datos JSON usada por json-server
├── package.json        # Configuracion del proyecto y dependencias
├── package-lock.json   # Arbol exacto de dependencias instaladas
└── node_modules/       # Dependencias instaladas (generado por npm)
```

Solo los cuatro primeros archivos son relevantes para entender y modificar el proyecto. La carpeta `node_modules` es generada automaticamente y no debe editarse manualmente.

---

## Descripcion de archivos principales

### index.html

Contiene la estructura visual de la aplicacion. Define tres elementos clave que el JavaScript referencia directamente por su `id`:

- `dataForm`: el formulario que maneja tanto la creacion como la edicion de elementos.
- `itemInput`: el campo de texto donde el usuario escribe el nombre del elemento.
- `itemList`: la lista `<ul>` donde se renderizan dinamicamente los elementos obtenidos de la API.
- `messegeFeedback`: un `<div>` que muestra mensajes de exito o error al usuario.
- `buttonSubmit`: el boton de envio, cuyo texto cambia entre "Agregar" y "Save Changes" segun el estado del formulario.

Bootstrap se carga desde un CDN externo, por lo que se necesita conexion a internet para que los estilos funcionen correctamente.

### app.js

Archivo central del proyecto. Contiene toda la logica de la aplicacion organizada en las siguientes funciones:

**`loadElements()`**
Realiza un `GET` a `http://localhost:8000/elementos`. Si la respuesta es exitosa, actualiza el array global `elements`, sincroniza con `localStorage` y llama a `renderList()`. Si la peticion falla (por ejemplo, si el servidor esta apagado), captura el error y carga los datos desde `localStorage` como fallback, notificando al usuario.

**`saveInLocalStorage()`**
Serializa el array `elements` a JSON y lo guarda en `localStorage` bajo la clave `"formElement"`. Se llama despues de cada operacion exitosa para mantener sincronizados la API y el almacenamiento local.

**`renderList()`**
Limpia el contenido actual de `itemList` y vuelve a construir cada elemento `<li>` del DOM a partir del array `elements`. Por cada elemento genera dinamicamente el texto con el nombre y dos botones: "Edit" y "Delete", con sus respectivos event listeners.

**Manejador del evento `submit` del formulario**
Determina si se trata de una operacion POST (creacion) o PUT (edicion) segun si `editingID` es `null` o contiene un id valido.

- En modo creacion, hace un `POST` con el cuerpo `{ name: valorDelInput }`.
- En modo edicion, hace un `PUT` a `http://localhost:8000/elementos/:id` con el mismo cuerpo.
- En ambos casos, tras la respuesta exitosa, recarga los elementos desde la API y actualiza el DOM.

**`prepareEdit(item)`**
Prepara el formulario para editar un elemento existente: rellena el campo de texto con el nombre actual del item, guarda su `id` en `editingID` y cambia el texto del boton a "Save Changes".

**`deleteData(id)`**
Realiza un `DELETE` a `http://localhost:8000/elementos/:id`. Si la peticion es exitosa, elimina el elemento del array global y actualiza el DOM sin necesidad de recargar toda la lista desde el servidor.

### db.json

Archivo que actua como base de datos para `json-server`. La estructura inicial es:

```json
{
  "elementos": [],
  "$schema": "./node_modules/json-server/schema.json"
}
```

La clave `"elementos"` define el recurso REST. `json-server` expone automaticamente los endpoints `GET`, `POST`, `PUT`, `PATCH` y `DELETE` sobre `http://localhost:8000/elementos`. Cada registro creado recibe un `id` unico asignado por el servidor.

### package.json

Define los metadatos del proyecto y las dependencias. El unico script configurado es:

```json
"scripts": {
  "dev": "json-server --watch db.json --port 8000"
}
```

Este comando inicia `json-server` en el puerto 8000, con vigilancia activa del archivo `db.json` (hot-reload automatico ante cambios manuales en el archivo).

La unica dependencia de produccion es `json-server` en su version beta `^1.0.0-beta.15`.

---

## Flujo de datos y logica de la aplicacion

```
Usuario escribe en el input y hace submit
        |
        v
  ¿editingID es null?
     /          \
   Si            No
   |              |
  POST           PUT
  /elementos     /elementos/:id
        |
        v
  Respuesta exitosa del servidor
        |
        v
  loadElements() -> GET /elementos
        |
        v
  saveInLocalStorage()
        |
        v
  renderList() -> actualiza el DOM
```

En caso de fallo de red en cualquier operacion de lectura, la aplicacion muestra el error en el feedback y utiliza los datos de `localStorage` para renderizar la lista.

---

## Requisitos previos

- Node.js instalado (version 14 o superior recomendada).
- npm incluido con Node.js.
- Un navegador moderno con soporte para Fetch API y `localStorage` (Chrome, Firefox, Edge, Safari actualizados).
- Conexion a internet solo para cargar Bootstrap desde el CDN.

Para verificar que Node.js y npm estan instalados:

```bash
node --version
npm --version
```

---

## Instalacion

1. Clonar o descomprimir el proyecto en una carpeta local.

2. Desde la terminal, navegar a la carpeta raiz del proyecto:

```bash
cd HUS4
```

3. Instalar las dependencias declaradas en `package.json`:

```bash
npm install
```

Esto crea la carpeta `node_modules` con `json-server` y sus dependencias internas. Si el proyecto ya incluye `node_modules`, este paso puede omitirse.

---

## Como ejecutar el proyecto

El proyecto tiene dos partes que deben correr al mismo tiempo: el servidor REST y el archivo HTML.

**Paso 1: Iniciar el servidor REST**

Desde la carpeta raiz del proyecto, ejecutar:

```bash
npm run dev
```

Esto inicia `json-server` en `http://localhost:8000`. La terminal mostrara algo similar a:

```
JSON Server started on PORT :8000
Press CTRL-C to stop
Watching db.json...
```

Los endpoints disponibles seran:

```
GET    http://localhost:8000/elementos
POST   http://localhost:8000/elementos
PUT    http://localhost:8000/elementos/:id
DELETE http://localhost:8000/elementos/:id
```

**Paso 2: Abrir el archivo HTML**

Abrir `index.html` directamente en el navegador. Puede hacerse de dos formas:

- Haciendo doble clic sobre el archivo desde el explorador de archivos del sistema operativo.
- Usando una extension como Live Server en VS Code para servir el archivo en un servidor local (recomendado para evitar restricciones CORS en algunos navegadores).

Una vez abierta la pagina con el servidor corriendo, la aplicacion cargara automaticamente los elementos existentes en `db.json` y estara lista para usar.

---

## Uso de la aplicacion

- **Agregar un elemento**: escribir un nombre en el campo de texto y hacer clic en "Agregar". El elemento aparece en la lista y se guarda en `db.json`.
- **Editar un elemento**: hacer clic en el boton "Edit" del elemento deseado. El formulario se llena con el nombre actual y el boton cambia a "Save Changes". Tras modificar el texto y enviar, el elemento se actualiza en el servidor.
- **Eliminar un elemento**: hacer clic en el boton "Delete". El elemento se elimina del servidor y desaparece de la lista sin recargar la pagina.
- **Funcionamiento sin servidor**: si el servidor no esta activo, la aplicacion muestra un mensaje de advertencia y carga los datos guardados en `localStorage` desde la ultima sesion exitosa. Las operaciones de escritura (POST, PUT, DELETE) no funcionaran en modo offline.

---

## Notas adicionales

- El archivo `db.json` se modifica en tiempo real con cada operacion de escritura. Si se desea restablecer la base de datos, basta con editar el archivo y dejarlo con `"elementos": []`.
- La propiedad `$schema` en `db.json` es utilizada internamente por `json-server` para validacion y puede ignorarse.
- El proyecto no tiene sistema de autenticacion ni validacion avanzada en el servidor; `json-server` acepta cualquier peticion valida.
- El repositorio oficial del proyecto se encuentra en: `https://github.com/Alejandroesbr/js-interactivo-api-cruds`