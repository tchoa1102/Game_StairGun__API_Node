const CONSTANT = require('./CONSTANT')

module.exports = class StickEventRes {
    constructor(_id, event, x, y, specialEvent) {
        this._id = _id
        this.event = event
        this.x = x
        this.y = y
    }
}
