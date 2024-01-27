import Point from './point'

export default class Vector {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    init(p1: Point, p2: Point): Vector {
        this.x = p2.x - p1.x
        this.y = p2.y - p1.y
        return this
    }
}
