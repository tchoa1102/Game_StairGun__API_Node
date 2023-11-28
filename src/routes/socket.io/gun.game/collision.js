const Point = require('./point')
class Collision {
    constructor(point, line) {
        this.location = new Point(point.x, point.y)
        this.line = line
    }
}

module.exports = Collision
