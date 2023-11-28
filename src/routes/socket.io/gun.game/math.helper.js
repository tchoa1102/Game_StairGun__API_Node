class MathHelper {
    degToRad(deg) {
        return (deg * Math.PI) / 180
    }

    radToDeg(rad) {
        return (rad * 180) / Math.PI
    }

    computeDelta(a, b, c) {
        // y = ax^2 + bx + c
        return b * b - 4 * a * c
    }

    solveEquationLevel2({ a, b, c }) {
        const delta = this.computeDelta(a, b, c)

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
}

module.exports = new MathHelper()
