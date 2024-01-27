// const Line = require('./line')

export default class Point {
    public x: number
    public y: number
    constructor(x?: number, y?: number) {
        this.x = x || 0
        this.y = y || 0
    }

    copy(p: Point) {
        this.x = p.x
        this.y = p.y
        return this
    }

    getAxis(axis: string): number {
        if (axis === 'x') return this.x
        return this.y
    }

    calcDistanceToPoint(p: Point) {
        return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2)
    }

    overlap(p: Point) {
        return this.x === p.x && this.y === p.y
    }

    newPointFromPointAndVector(vectorU: any) {
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

    isPointInPolygon(point: Point, vertices: any) {
        const numVertices = vertices.length
        let intersections = 0

        for (let i = 0; i < numVertices; i++) {
            const indexLastPoint = (i + 1) % numVertices
            const f_point = vertices[i]
            const l_point = vertices[indexLastPoint]

            if (
                (f_point.y <= point.y && point.y < l_point.y) ||
                (l_point.y <= point.y && point.y < f_point.y)
            ) {
                if (
                    point.x <
                    ((l_point.x - f_point.x) * (point.y - f_point.y)) / (l_point.y - f_point.y) +
                        f_point.x
                )
                    intersections += 1
            }
        }

        return intersections % 2 === 1
    }
}
