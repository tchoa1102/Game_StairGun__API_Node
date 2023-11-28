const configGame = require('../../../gameConfig.json')
const Line = require('./line')
const MathHelper = require('./math.helper')
const Parabola = require('./parabola')
const Point = require('./point')

class Bullet {
    constructor(x0, y0, angle, velocity_0, windForce) {
        /** y↑angle ↗
         *   |৲   ∕
         *   | )∕
         *  O⊥∕---------→x
         */
        const mathConfig = configGame.math
        const rad = MathHelper.degToRad(angle)
        const temp = ((velocity_0 * windForce) / mathConfig.m) * Math.cos(rad) // = x - x_0
        this.location = new Point(x0, y0)
        this.a = -mathConfig.g / (2 * temp ** 2)
        this.b = (mathConfig.g * x0) / temp ** 2 + Math.tan(rad)
        this.c = (-mathConfig.g * x0 ** 2) / (2 * temp ** 2) - x0 * Math.tan(rad) + y0
        this.parabola = new Parabola(this.a, this.b, this.c)
    }

    findCollision(shape_players, polygons, findRegularCallback) {
        const playerCollisions = shape_players.reduce((total, p) => {
            const numLine = p.length
            for (let i = 0; i < numLine; ++i) {
                const lastIndex = (i + 1) % numLine
                const tarLine = new Line().init(p[i], p[lastIndex])
                const intersection = this.parabola.intersectionWithStraightLine(tarLine)
                if (!intersection) continue
                total.push(...intersection)
            }
            return total
        }, [])
        const polygonCollisions = polygons.reduce((total, poly) => {
            const polyPoint = poly.data.points
            const numLine = polyPoint.length
            for (let i = 0; i < numLine; ++i) {
                const lastIndex = (i + 1) % numLine
                const f_edge = getLocationOnOxy(poly.location, polyPoint[i])
                const l_edge = getLocationOnOxy(poly.location, polyPoint[lastIndex])
                const tarLine = new Line().init(f_edge, l_edge)
                const intersection = this.parabola.intersectionWithStraightLine(tarLine)
                total.push(...intersection)
            }
            return total
        }, [])
        // console.log(playerCollisions, polygonCollisions)
        const collision = [...playerCollisions, ...polygonCollisions].reduce(
            (result, collision) => {
                if (findRegularCallback(this.location.x, collision.location.x)) {
                    if (!result) {
                        result = collision
                    }
                    if (!findRegularCallback(result.location.x, collision.location.x))
                        result = collision
                }
                return result
            },
            null,
        )

        return collision
    }
}

function getLocationOnOxy(location, point) {
    return new Point(point.x + location.x, -(point.y + Math.abs(location.y)))
}

module.exports = Bullet
