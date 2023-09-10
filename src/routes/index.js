const stair = require('./stair.router')

function routes(app) {
    app.use('/api/matches/:match/stair', stair)
}

module.exports = routes
