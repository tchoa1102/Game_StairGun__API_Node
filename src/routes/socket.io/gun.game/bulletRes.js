const Point = require('./point')

class BulletRes {
    constructor(point, angle) {
        this.point = new Point(point.x, point.y)
        this.angle = angle
    }
}

module.exports = BulletRes
