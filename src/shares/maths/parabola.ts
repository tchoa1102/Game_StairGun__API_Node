import Point from './point'
import MathHelper from './math.helper'
import Collision from './collision'
import Line from './line'

export default class Parabola {
    public a: number
    public b: number
    public c: number
    constructor(a?: number, b?: number, c?: number) {
        this.a = a || 0
        this.b = b || 0
        this.c = c || 0
    }

    copy(p: Parabola) {
        this.a = p.a
        this.b = p.b
        this.c = p.c
        return this
    }

    sumLine(line: any) {
        // @with line: {a, b}, y = ax + b
        // ax^2 + bx + c = ax + b
        this.b -= line.a
        this.c -= line.b
        return this
    }

    computeY(x: number) {
        return this.a * x ** 2 + this.b * x + this.c
    }

    intersectionWithStraightLine(line: Line) {
        const l = line.createVariable()
        const equationL2 = new Parabola().copy(this).sumLine(l)
        const xIntersection = MathHelper.solveEquationLevel2(equationL2)
        if (!xIntersection) return []
        const intersection = xIntersection.reduce((result: Array<Collision>, x: number) => {
            const pointInter = new Point(x)
            if (line.isPointInside(pointInter)) {
                const newIntersection = new Collision(pointInter, line)

                result.push(newIntersection)
            }
            return result
        }, [])

        return intersection
    }
}
