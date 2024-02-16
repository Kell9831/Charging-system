# Charging System

Este proyecto presenta un sistema de carga que proporciona una API RESTful para la creación de usuarios. Permite a los usuarios con autorización "admin" crear usuarios a partir de un archivo CSV. De haber error en la validacion con alguno de los campos, estos se detallan para poder solucionarlos posteriormente.

## Tabla de Contenidos
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Endpoints](#endpoints)
- [Ejemplos de Solicitudes](#ejemplos-de-solicitudes)
- [Autenticación](#autenticación)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Requisitos

Para poder trabajar con este proyecto, es necesario tener las siguientes herramientas instaladas en tu entorno de desarrollo:

- Node.js
- TypeScript
- npm
- PostgreSQL

## Instalación

Para comenzar a trabajar con este proyecto, sigue estos pasos:

1. Clona este repositorio:

## Instalación

2. Para comenzar, puedes clonar este repositorio utilizando el siguiente comando en tu terminal:

```bash
git clone https://github.com/Kell9831/Charging-system
cd Charging-system
```


Instala las dependencias:
```bash
npm install
```
3. Ejecuta un reset de las migraciones con umzug:
 ```bash
npm run db:reset
```
Inicia el servidor:
```bash
npm run dev
```
## Configuración
Para configurar correctamente tu entorno de desarrollo, necesitarás crear un archivo `.env` en la raíz del proyecto y establecer las siguientes variables de entorno.

En el archivo .env.example, proporciona una plantilla para que los usuarios puedan copiarla y configurar las variables según sus necesidades, quedando similiar al siguiente ejemplo:.
 ```bash
# Contenido del archivo .env
NAME_DB=[admin-database]
USER_DB=[usuario]
PASS_DB=[password]
PGHOST=[localhost]
PGPORT=[puerto]

# Configuración del token JWT
JWT_SECRET=[keygenstring]
COST_FACTOR=[factor]
```
Asegúrate de proporcionar valores específicos para cada variable según los requisitos de tu aplicación.
## Estructura del proyecto
La aplicación sigue una arquitectura de tres capas:

- **Routers**: Define las rutas y maneja las solicitudes HTTP.
- **Servicios**: Contiene la lógica de negocio y se comunica con la capa de acceso a datos.
- **Acceso a Datos**: Gestiona las interacciones con la base de datos PostgreSQL utilizando pg.

## Endpoints
- **Autenticación**: Endpoint `/login` para autenticación de usuarios, que verifica credenciales (email y password) y retorna un token JWT.
- **Carga de Datos**: Endpoint `/upload` protegido con middleware de autorización, para la carga y procesamiento de archivos CSV.
- 
### **Middleware de Autorización**

- Verifica el JWT en cada solicitud al endpoint `/upload`, asegurando que solo usuarios con rol de `admin` puedan acceder.
- Un usuario con rol `admin` deberá ser pre-creado en la base de datos (seed).

### **Procesamiento de Archivos CSV**

- Recibe archivo CSV en endpoint `/upload`
- Leer y validar el contenido del archivo CSV (name, email, age) y por cada fila crear un registro en la tabla `users`
## Ejemplos de solicitudes
- Generar una respuesta detallada con los registros exitosos y un informe de errores específicos por registro y campo:
 ```bash
{
	"ok": true,
	"data": {
	  "success": [
	    {
	      "id": 1,
	      "name": "Juan Perez",
	      "email": "juan.perez@example.com",
	      "age": 28
	    }
	    // Otros registros exitosos...
	  ],
	  "errors": [
	    {
	      "row": 4,
	      "details": {
	        "name": "El campo 'name' no puede estar vacío.",
	        "email": "El formato del campo 'email' es inválido.",
	        "age": "El campo 'age' debe ser un número positivo."
	      }
	    }
	    // Otros registros con errores...
	  ]
	}
}
 ```
## Contribuciones
Si deseas contribuir al desarrollo de esta API, simplemente realiza un Pull Request con tus cambios y para que sean revisados.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para obtener más detalles.8
