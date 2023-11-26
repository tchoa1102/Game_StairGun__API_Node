// const Line = require('./line')

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

    newPointFromPointAndVector(vectorU) {
        const vectorN = { a: -vectorU.b, b: vectorU.a }
        if (vectorN.b === 0)
            return {
                x: this.x,
                y: this.y - 50,
            }
        if (vectorN.a === 0)
            return {
                x: this.x + 50,
                y: this.y,
            }
        const a = -vectorN.a / vectorN.b
        const b = (vectorN.a * this.x + vectorN.b * this.y) / vectorN.b
        const newY = this.y - 50
        return new Point((a * this.x - b * (newY - this.y)) / a, newY)
    }
}

module.exports = Point
