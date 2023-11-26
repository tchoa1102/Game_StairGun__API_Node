class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    copy(p) {
        this.x = p.x
        this.y = p.y
        return this
    }

    calcDistanceToPoint(p) {
        return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2)
    }

    overlap(p) {
        return this.x === p.x && this.y === p.y
    }
}

module.exports = Point
