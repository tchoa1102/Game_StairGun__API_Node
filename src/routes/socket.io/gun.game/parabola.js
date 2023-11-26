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
        const l = createVariableLine(line.first, line.last)
        const equationL2 = new Parabola().copy(this).sumLine(l)
        const xIntersection = solveEquationLevel2(equationL2)
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

function computeDelta(a, b, c) {
    // y = ax^2 + bx + c
    return b * b - 4 * a * c
}

function solveEquationLevel2({ a, b, c }) {
    const delta = computeDelta(a, b, c)

    if (delta > 0) {
        const root1 = (-b + Math.sqrt(delta)) / (2 * a)
        const root2 = (-b - Math.sqrt(delta)) / (2 * a)
        return [root1, root2]
    } else if (delta === 0) {
        const root = -b / (2 * a)
        return [root]
    }
    return null
}

module.exports = Parabola
