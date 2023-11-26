const MathHelper = require('./math.helper')

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
        this.c -= line.c
        return this
    }

    computeY(x) {
        return a * x ** 2 + b * x + c
    }

    intersectionWithStraightLine(line) {
        const l = line.createVariable()
        const equationL2 = new Parabola().copy(this).sumLine(l)
        const xIntersection = MathHelper.solveEquationLevel2(equationL2)
        if (!xIntersection) return null
        const intersection = []
        xIntersection.forEach((x) => {
            const newIntersection = {
                x,
                y: equationL2.computeY(x),
            }
            intersection.push(newIntersection)
        })

        return intersection
    }
}

module.exports = Parabola
