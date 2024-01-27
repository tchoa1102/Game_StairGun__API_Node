import Line from './line'

export default class NearestPolygon {
    public polygon: null
    public line: Line
    public distance: number
    constructor() {
        this.polygon = null
        this.line = new Line()
        this.distance = Infinity
    }
}
