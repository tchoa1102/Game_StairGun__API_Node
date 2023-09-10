const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class StairGameController {
    // [GET] api/matches/:match/stair
    get(req, res, next) {
        return res.json('Hello stair game!')
    }
}

module.exports = new StairGameController()
