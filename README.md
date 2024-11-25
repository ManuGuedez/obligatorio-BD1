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

La aplicación está pensada para tres vistas dependiendo del rol del usuario logueado.

### Administrador de la Plataforma:

El Administrador tiene acceso completo a la gestión de la plataforma y puede realizar las siguientes acciones:

1. **Gestión de Instructores y Alumnos**: Alta, baja y modificación (ABM).
2. **Asignación de Alumnos a Clases**: Agregar o eliminar alumnos en clases específicas.
3. **Gestión de Turnos**: ABM de turnos disponibles.
4. **Creación y Eliminación de Clases.**
5. **Visualización de Actividades**: Listar todas las actividades con información detallada.
6. **Generación de Reportes**: Estadísticas de inscripciones y clases dictadas.

#### Baja de Instructores y Alumnos:

El proceso de baja de instructores y alumnos se realiza mediante borrado lógico.
En el sistema, se asigna un valor a una variable:
  1: Indica que el instructor o alumno ha sido dado de baja.
  0: Indica que el instructor o alumno está activo.

### Instructor
Un instructor puede realizar las siguientes tareas:

1. **Ver Clases Asignadas**: Información detallada de clases del día (actividad, horario, días).
2. **Marcar Asistencia**: Registrar asistencia de alumnos y marcar la clase como dictada.
3. **Acceder a su Calendario**: Visualizar clases asignadas según la fecha.

### Alumno
Un alumno tiene acceso a las siguientes funcionalidades:

1. **Visualizar Clases Disponibles**: Según los horarios disponibles.
2. **Inscribirse en Cursos Recomendados**.
3. **Consultar Cursos Inscritos**: Con información detallada.
4. **Darse de Baja de Cursos**.
5. **Alquiler de Equipamiento**: Basado en las clases inscritas.


#### Creación de cuentas y roles

Para ingresar al sistema como usuario, es necesario que primero el administrador registre a la persona en el sistema, asignándole un rol específico.

Una vez registrada, la persona puede crear su cuenta y establecer sus credenciales de acceso.

Esta lógica se implementa porque consideramos que corresponde al administrador del sistema habilitar a los usuarios. Sin embargo, permitir que el administrador cree las cuentas iniciales implicaría asignar contraseñas, las cuales deberían ser cambiadas posteriormente por los usuarios. Por ello, y dado el alcance del proyecto, decidimos implementar un sistema donde los propios usuarios puedan crear sus cuentas, restringiendo esta funcionalidad únicamente a quienes ya hayan sido previamente registrados por el administrador.

