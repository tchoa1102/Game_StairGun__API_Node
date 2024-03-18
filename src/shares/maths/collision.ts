import Line from './line'
import Point from './point'
class Collision {
    public location?: Point
    public line?: Line
    constructor(point: Point, line?: Line) {
        this.location = new Point(point.x, point.y)
        this.line = line
    }

    isValidX(): boolean {
        if (!this.line || !this.location) return false
        if (this.line.isPointInside(this.location)) {
            return true
        }

        return false
    }
}

export default Collision
