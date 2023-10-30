// Recibir y cargar variables de entorno
import * as dotenv from 'dotenv'
dotenv.config()

// Obtener configuración de la base de datos
import { AppDataSource } from "./data-source"

// Librerías asociadas al framework del backend
import * as express from 'express'
import ApiRouter from "./api/ApiRouter"
import { initialSeed } from "./initialSeed"


// Inicializar base de datos y verificar información
AppDataSource.initialize()
    .then(async () => {
        await initialSeed()
        console.log('Base de datos cargada con éxito')
    })
    .catch(error => console.log(error))


// Crear aplicación de Express
const app = express()
app.use(express.json())

// Rutas de la API
app.use(ApiRouter)

// Ejecutar aplicación
const PORT = process.env.APP_PORT || 5000
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
