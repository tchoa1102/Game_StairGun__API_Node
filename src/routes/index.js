const stair = require('./stair.router')
const match = require('./match')
const room = require('./room.router')
const card = require('./card.route')
const item = require('./item.route')
const middlewares = require('../middlewares')
const { AuthController } = require('../app/controllers')

function routes(app) {
    // app.use
    app.use('/api', middlewares.decodeToken, middlewares.findUser)
    app.get('/api/auth/login', (req, res, next) => {
        return res.json({ message: 'Success logging' })
    })
    app.use('/api/rooms', room)
    app.use('/api/auth/load', AuthController.load)
    app.use('/api/cards', card)
    app.use('/api/items', item)
    // app.use('/api/matches/:match/stair', stair)
    // app.use('/api/matches', match)
}

module.exports = routes
