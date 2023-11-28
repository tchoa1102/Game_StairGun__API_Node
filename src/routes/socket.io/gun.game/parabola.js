const Point = require('./point')
const MathHelper = require('./math.helper')
const Collision = require('./collision')

class Parabola {
    constructor(a, b, c) {
        this.a = a
        this.b = b
        this.c = c
    }

    copy(p) {
        this.a = p.a
        this.b = p.b
        this.c = p.c
        return this
    }

    sumLine(line) {
        // @with line: {a, b}, y = ax + b
        // ax^2 + bx + c = ax + b
        this.b -= line.a
        this.c -= line.b
        return this
    }

    computeY(x) {
        return this.a * x ** 2 + this.b * x + this.c
    }

    intersectionWithStraightLine(line) {
        const l = line.createVariable()
        const equationL2 = new Parabola().copy(this).sumLine(l)
        const xIntersection = MathHelper.solveEquationLevel2(equationL2)
        if (!xIntersection) return []
        const intersection = xIntersection.reduce((result, x) => {
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

module.exports = Parabola
