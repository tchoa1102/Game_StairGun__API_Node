const stair = require('./stair.router')
const match = require('./match')

function routes(app) {
    app.use('/api/matches/:match/stair', stair)
    app.use('/api/matches', match)
}

module.exports = routes
