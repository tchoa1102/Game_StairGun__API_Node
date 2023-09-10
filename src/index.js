const fs = require('fs')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const { Server } = require('socket.io')

// Import dotenv
const keyPath = path.join(__dirname, '../.env')
if (fs.existsSync(keyPath)) {
    console.log('dotenv is exists!')
    require(keyPath)
    console.log('Imported env file')
}

const config = require('./config/server')
const router = require('./routes')
const routerSocketIO = require('./routes/socket.io')
const db = require('./config/db')
const { createServer } = require('http')

const app = express()
const server = createServer(app)
const io = new Server(server)

// middleware
app.use(morgan('combined'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Routes
router(app)
routerSocketIO(io)
app.use((error, req, res, next) => {
    console.log(error)
    return res.status(500).json({
        message: 'Có lỗi xảy ra!',
    })
})

// start
async function main() {
    await db.connect()
    console.log(config.port)
    server.listen(config.port, () => {
        console.log('Listening on port ' + config.port + '\nWelcome to game!')
    })
}

main()
