import Point from './point'
class Collision {
    public location: any
    public line: any
    constructor(point: Point, line: any) {
        this.location = new Point(point.x, point.y)
        this.line = line
    }
}

export default Collision
