const { request } = require('https')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class StairGameController {
    // [GET] api/matches/:match/stair
    get(req, res, next) {
        return res.json({ message: 'Welcome to Stair Gun Game' })
    }
}

module.exports = new StairGameController()
