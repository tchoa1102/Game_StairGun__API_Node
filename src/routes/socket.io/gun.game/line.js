const Point = require('./point')
const MathHelper = require('./math.helper')

class Line {
    constructor() {
        this.first = null
        this.last = null
    }

    init(first, last) {
        this.first = first
        this.last = last
        return this
    }

    copy(newLine) {
        this.first = newLine.first
        this.last = newLine.last
    }

    center() {
        return new Point((this.first.x + this.last.x) / 2, (this.first.y + this.last.y) / 2)
    }

    createVector() {
        return {
            x: this.last.x - this.first.x,
            y: this.last.y - this.first.y,
        }
    }

    distance() {
        return Math.sqrt((this.first.x - this.last.x) ** 2 + (this.first.y - this.last.y) ** 2)
    }

    // AKA overlap on an axis
    isPointInside(point, axis = 'x') {
        const valuePoint = point[axis]
        const f = this.first[axis]
        const l = this.last[axis]
        return !(valuePoint > f && valuePoint > l) && !(valuePoint < f && valuePoint < l)
    }

    // AKA overlap on an axis
    isInside(mainLine, axis) {
        /** Check main_f and main_l points inside space area of polygon, by axis.
         * |	main_f			|
         * |			main_l	|
         * |					|
         * polygon_f_point  polygon_l_point
         */
        // cách 1 -> bug
        // const m_f_inside = checkPointInside(main_f_point, polygon_f_point, polygon_l_point, axis)
        // const m_l_inside = checkPointInside(main_l_point, polygon_f_point, polygon_l_point, axis)
        // return m_f_inside && m_l_inside
        // cách 2
        const m_f = mainLine.first[axis]
        const m_l = mainLine.last[axis]
        const p_f = this.first[axis]
        const p_l = this.last[axis]

        const twoPointAreAllLarger = m_f > p_f && m_l > p_f && m_f > p_l && m_l > p_l
        const twoPointAreAllSmaller = m_f < p_f && m_l < p_f && m_f < p_l && m_l < p_l
        return !twoPointAreAllSmaller && !twoPointAreAllLarger // or !(twoPointAreAllSmaller || twoPointAreAllLarger)
    }

    is3PointOnCommonLine(p1, p2, p3) {
        // v12.x / v13.x = v12.y / v13.y <=> v12.x * v13.y = v12.y * v13.x | k = v13.x / v12.x => v13.y / v12.y = k
        const point1 = new Point(p1.x, p1.y)
        if (point1.overlap(p2) || point1.overlap(p3)) return true
        const l1 = new Line().init(p1, p2)
        const l2 = new Line().init(p1, p3)
        const v12 = l1.createVector()
        const v13 = l2.createVector()
        const k = v13.x / v12.x
        const kq = v13.y - v12.y * k

        return Math.abs(kq) < 1e-8
    }

    isPointInsideAvoidTwoHead(point, axis) {
        const valuePoint = point[axis]
        const f = this.first[axis]
        const l = this.last[axis]
        return !(valuePoint >= f && valuePoint >= l) && !(valuePoint <= f && valuePoint <= l)
    }

    findXFromY(y) {
        // console.log('Data received: ', x, ", ", this.first, ', ', this.last)
        return (
            (-(this.last.x - this.first.x) * (y - this.first.y)) / (this.first.y - this.last.y) +
            this.first.x
        )
    }

    findYFromX(x) {
        // console.log('Data received: ', x, ", ", this.first, ', ', this.last)
        return (
            (-(this.first.y - this.last.y) * (x - this.first.x)) / (this.last.x - this.first.x) +
            this.first.y
        )
    }

    createVariable() {
        // y = ax + b | ax + b = 0
        let a = -(this.first.y - this.last.y)
        let b = -(this.first.x * this.last.y - this.first.y * this.last.x)
        const coefficient = this.last.x - this.first.x
        const isYExist = coefficient !== 0
        if (isYExist) {
            a /= coefficient
            b /= coefficient
        }
        return { a, b, isYExist }
    }

    calcIntersectionPoint(line) {
        const line1 = this.createVariable()
        const line2 = line.createVariable()

        if (line1.a === line2.a && line1.b === line2.b) return Infinity
        if (!line1.isYExist) {
            if (!line2.isYExist) {
                return null
            }
            const x = -line1.b / line1.a
            return { x, y: line2.a * x + line2.b }
        }
        if (!line2.isYExist) {
            // <=> line1.isYExist && !line2.isYExist
            const x = -line2.b / line2.a
            if (!Number.isFinite(x)) return x
            return new Point(x, line1.a * x + line1.b)
        }
        if (line1.a === line2.a) return null
        const x = (line2.b - line1.b) / (line1.a - line2.a)
        return new Point(x, line1.a * x + line1.b)
    }

    //  true RightAngle | => newAngle = v + g = v + arctan(rightAngle_l_p / rightAngle_f_p)
    //      |\
    //      |v\	v=90			v = 0
    // f_p o\---|o  rightAngle   o---/o l_p
    //       \g |       |	     |  /
    //        \ |       |	     |g/
    //         \|o l_p  |  f_p  o|/
    calcAngle() {
        /**
         *     | => 0deg     ___________ => 90deg     A\--| C(xB, yA)   C(xA, yB)|--/B
         *     |                                        \ |                      | /
         *     |                                         \|B                    A|/
         */
        const f_p = this.first
        const l_p = this.last
        if (f_p.x === l_p.x) return 0
        if (f_p.y === l_p.y) return 90
        const rightAngle = {
            x: f_p.x,
            y: l_p.y,
        }
        let tempAngle = 0

        if (f_p.y > l_p.y) {
            rightAngle.x = l_p.x
            rightAngle.y = f_p.y
            tempAngle = 90
        }

        const lineNear = new Line().init(f_p, rightAngle)
        const lineFront = new Line().init(l_p, rightAngle)

        const newAngle = MathHelper.radToDeg(Math.atan(lineFront.distance() / lineNear.distance()))
        return tempAngle + newAngle
    }

    calcDistanceTwoPointOnLineCommonAxis(point, distanceForAxis) {
        /**
         * B o\       distanceForAxis = 'x' | y↑____B_o\       distanceForAxis = 'y'
         *     \<----->o Point              |  ¦I      |\       => change y location
         *     |\   change x location       |  ¦       | \
         *     | \o A                       | O¦_Point o  \o A
         *  O——I———————Point—————→x (Ox)   |
         *     |-result-|                   |  result = I_y - Point_y
         * => result(x) = I[distanceForAxis] - Point[distanceForAxis] | result(y) = - result(x)
         */
        const commonAxis = distanceForAxis === 'x' ? 'y' : 'x'
        if (!this.isPointInside(point, commonAxis)) return -Infinity
        // default for axis = 'y'
        const pointInLine = {
            x: point.x,
            y: this.findYFromX(point.x),
        }
        if (distanceForAxis === 'x') {
            pointInLine.x = this.findXFromY(point.y)
            pointInLine.y = point.y
        }
        const result = point[distanceForAxis] - pointInLine[distanceForAxis]

        if (distanceForAxis === 'y') return -result
        return result
    }
}

module.exports = Line
