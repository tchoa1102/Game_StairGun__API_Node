class MathHelper {
    degToRad(deg: number) {
        return (deg * Math.PI) / 180
    }

    radToDeg(rad: number) {
        return (rad * 180) / Math.PI
    }

    computeDelta(a: number, b: number, c: number) {
        // y = ax^2 + bx + c
        return b * b - 4 * a * c
    }

    solveEquationLevel2({ a, b, c }: { a: number; b: number; c: number }) {
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

export default new MathHelper()
