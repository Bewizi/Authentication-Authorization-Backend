import express from 'express'
import appConfig from './shared/config'
import databaseConfig from './shared/config/database.config'
import rootRoutes from "./rootRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// main routes
app.use('/api/', rootRoutes)

app.listen(appConfig.app.port, appConfig.app.host, async () => {
    // await databaseConfig.sync({alter: false})
    await databaseConfig.sync({alter: true})
    console.log(`app listening on ${appConfig.app.port} on ${appConfig.app.host}`)
})