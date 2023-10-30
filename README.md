# MediApp Backend

Creado y Programado en NodeJS empleando el framework ExpressJS en conjunto con Typescript y TypeORM.

## Requisitos previos
1. Instalar NodeJS 20.7.0 con última version de npm.
2. Instalar yarn en su última version.
3. Instalar PostgreSQL en su version 15.

## Crear archivo para variables de entorno (.env)

El archivo .env debe tener la siguiente estructura:

```.dotenv
SECRET_KEY=
APP_PORT=9000

DB_NAME=
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASSWORD=

SEED_DATA=true
```

En desarrollo se utilizó siempre el puerto 9000, por lo que este puerto también se usa fuertemente en el 
frontend. La variable SEED_DATA establece los tipos iniciales de usuario y el usuario administrador.

El usuario administrador posee las siguientes credenciales:
* email: admin@admin.com
* password: pass

## POSTGRESQL

Se debe crear la base de datos con los datos establecidos en el archivo .env. El usuario debe ser dueño de la 
base de datos.

Pasos a seguir serían:
1. Entrar en la consola de Postgres usando el usuario postgres.
2. Crear base de datos con el nombre estipulado en DB_NAME.
3. Crear el usuario con los valores establecidos en DB_USER y DB_PASSWORD.
4. Volver al usuario dueño de la base de datos con todos sus privilegios.

De manera usual y predeterminada, el puerto de Postgres es el 5432, verificar esto último y si no lo es 
utilizar el que corresponda en el archivo .env.

## Instalación de dependencias
1. En la carpeta raíz del proyecto, ejecutar el siguiente comando para instalar las dependencias:
```
npm install
# o
yarn  # PREFERENCIA
```
2. Luego ejecutar el proyecto en modo desarrollo empleando:
```
npm run dev
# o
yarn dev  # PREFERENCIA 
```

## Datos en el proyecto al iniciar

El proyecto solo tendrá los dos tipos de usuarios (Administrador y Paciente) y el super administrador. 
Por lo que será necesario crear las 5 preguntas con sus respectivas alternativas en el frontend.

Para crear usuarios pacientes, se establece un registro, el que se puede acceder en el frontend.

## Dependencias utilizadas

* Typescript: Permite trabajar con tipado fuerte dentro de javascript y nodeJS, lo que ayuda en muchos aspectos,
desde encapsulamiento de clases, reconocimiento de errores y flujo de datos, hasta manejo tipado de respuestas. 
Para funcionar en NodeJS necesita de librerías de tipos para cada dependencia que lo requiera,
archivos de configuración y dependencias de compilación.
* Express: Framework web utilizado.
* TyperORM: Utilizado para mapear en clases/objetos los modelos de la base de datos, y poder trabajar con ellas para
manejar la información presente de mejor forma y con tipado/validación fuerte. Requiere de reflect-metadata.
* class-validator: Empleado para realizar validación de campos.
* pg/pg-hstore: Corresponde al cliente y deserializador de PostgreSQL para Node. Requerido para establecer las 
conexiones a la base de datos por TypeORM.
* bcrypt: Usado para encriptar las contraseñas de los usuarios en la base de datos y poder realizar autentificación 
con las mismas.
* JsonWebToken: Usado para crear tokens de tipo Bearer para acceso autenticado en backend.
* Cors: Establece la configuración para el intercambio de recursos cruzados.
* Dotenv: Empleado para leer las variables de entorno.
