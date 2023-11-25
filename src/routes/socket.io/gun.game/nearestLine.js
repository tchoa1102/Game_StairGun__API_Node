const Line = require('./line')

class NearestLine {
    constructor(distanceDefault = -Infinity) {
        this.distance = distanceDefault
        this.line = new Line()
    }

    copy(newNearestLine) {
        this.distance = newNearestLine.distance
        this.line.copy(newNearestLine.line)
    }
}

module.exports = NearestLine
