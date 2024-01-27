import Line from './line'

class NearestLine {
    public distance: number
    public line: Line
    constructor(distanceDefault = -Infinity) {
        this.distance = distanceDefault
        this.line = new Line()
    }

    copy(newNearestLine: NearestLine) {
        this.distance = newNearestLine.distance
        this.line.copy(newNearestLine.line)
    }
}

export default NearestLine
