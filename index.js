import path from 'path'
import express from 'express'
import dotenv from 'dotenv';
import { dbConnection } from './DB/connection.js';
import { bootStrap } from './src/bootStrap.js';
const app = express()
dotenv.config({ path: path.resolve("./config/.env") })
const port = process.env.PORT
// connect to db 
dbConnection()
// api  
bootStrap(app, express)
  

app.listen(port, () => console.log(`app listening on port ${port}!`))