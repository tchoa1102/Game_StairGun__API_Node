import Point from '../../../shares/maths/point'

export default class BulletState {
    public point: any
    public angle: number
    constructor(point: Point, angle: number) {
        this.point = new Point(point.x, point.y)
        this.angle = angle
    }
}
