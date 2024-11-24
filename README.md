# Proyecto de Base de Datos

Este proyecto utiliza una arquitectura basada en tres capas principales:

1. **Base de Datos**: Levantada con un contenedor Docker utilizando SQL.
2. **Backend**: Construido con Python, encargado de manejar la lógica y las API.
3. **Frontend**: Desarrollado con React.js para la interfaz de usuario.

## Requisitos previos

Antes de empezar, para poder levantar el proyecto es necesario tener en instalados los siguientes programas:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (incluye npm)
- [Python](https://www.python.org/) (versión 3.8 o superior)

Además, se debe tener configurado el comando `docker-compose` para levantar los servicios necesarios.

## Pasos para correr el proyecto

### 1. Levantar la base de datos con Docker

Una vez dentro del directorio del proyecto, utiliza el siguiente comando para levantar el contenedor de la base de datos:
  `docker-compose up -d`
Esto creará y ejecutará el contenedor de la base de datos especificado en el archivo docker-compose.yml.

### 2. Instalar dependencias Frontend

Para levantar el proyecto de frontend, es necesario dirigirse a la carpeta `frontend` y ejecutar el siguiente comando:
  `npm install`
Esto descargará las dependencias necesarias en la carpeta `node_modules`.

### 3. Iniciar el servidor Backend

Es recomendable activar previamente un entorno virtual para poder gestionar correctamente las dependencias.
Ejecutar el comando `py app.py`.
El servidor estará disponible en el puerto configurado (por defecto, http://localhost:5000).

### 4. Iniciar el servidor Frontend

Una vez instaladas las dependencias, ejecuta:
`npm run dev`
El servidor del frontend se levantará, y estará disponible en el puerto configurado (por defecto, http://localhost:5173).

## Descripción de la Aplicación

La aplicación está penada para tres vistas dependiendo del rol del usuario logueado (continuar). 
