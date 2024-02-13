import fs from 'fs'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

// Import dotenv
dotenv.config()

// const keyPath = path.resolve(process.cwd(), '.env')
// if (fs.existsSync(keyPath)) {
//     console.log('[SYS] dotenv is exists!')
//     require(keyPath)
//     console.log('[SYS] Imported env file')
// }

import config from './config/server'
import router from './routes/http-https'
import routerSocketIO from './routes/socket.io'
import db from './config/db'
import { createServer } from 'http'
import configGame from './gameConfig.json'
import middlewares from './middlewares'

// #region Server configuration
const optionCORS: cors.CorsOptions = {
    origin(requestOrigin, callback) {
        const origins: string = process.env.ALLOWED_ORIGINS || ''
        const isAllowed = origins.includes(requestOrigin || '')
        if (isAllowed) return callback(null, requestOrigin)
        return callback(new Error('Origin is not allowed!'), requestOrigin)
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: optionCORS,
})
// #endregion Server configuration

// #region middleware
app.use(cors(optionCORS))
app.use(morgan('combined'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// #endregion middleware

// #region Routes
app.use((req: any, res: any, next: any) => {
    console.log(
        `\x1b${configGame.colors.bg.green}%s\x1b${configGame.colors.reset}`,
        '->->->->->->->->->-> handling request <-<-<-<-<-<-<-<-<-<-',
    )
    try {
        next()
    } catch (error) {
        console.log(error)
    }
    // console.log(
    //     `\x1b${configGame.colors.bg.gray}%s\x1b${configGame.colors.reset}`,
    //     '-x-x-x-x-x- request was handled -x-x-x-x-x-',
    // )
})
router(app)
io.use(middlewares.decodeTokenSocket)
routerSocketIO(io)
app.use((error: any, req: any, res: any, next: any) => {
    console.log(error)
    return res.status(500).json({
        message: 'Có lỗi xảy ra!',
    })
})
// #endregion Routes

// start
async function mainFlow(): Promise<void> {
    console.log('[CONF] Config port: ', config.port, '')
    try {
        await db.connect()
        server.listen(config.port, () => {
            console.log('[SYS] Listening on port ' + config.port + '\n[SYS] Welcome to game!\n')
        })
    } catch (error) {
        console.log('An error correct: ', error)
    }
}

mainFlow()
