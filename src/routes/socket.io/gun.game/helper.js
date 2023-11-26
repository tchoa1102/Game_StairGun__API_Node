const configGame = require('../../../gameConfig.json')
const Point = require('./point')
const Line = require('./line')
const Parabola = require('./parabola')
const NearestLine = require('./nearestLine')

const CONSTANTS = {
    numError: 1e-8,
}

function getLocationOnOxy(location, point) {
    return new Point(point.x + location.x, -(point.y + Math.abs(location.y)))
}

function convertDegToRad(deg) {
    return (deg * Math.PI) / 180
}

function convertRadToDeg(rad) {
    return (rad * 180) / Math.PI
}

function getEquationBullet({ angle, v0, forceWind }) {
    const mathConfig = configGame.math
    const rad = convertDegToRad(angle)
    return {
        a: mathConfig.g / (((2 * v0 * forceWind) / mathConfig.m) * Math.cos(rad)) ** 2,
        b: Math.tan(rad),
    }
}

function nearestNeighborPolygon(main_shape, polygons) {
    const m_left_f = new Point().copy(main_shape[3])
    const m_left_l = new Point().copy(main_shape[2])
    const m_right_f = new Point().copy(main_shape[0])
    const m_right_l = new Point().copy(main_shape[1])
    const m_bottom_f = m_right_l
    const m_bottom_l = m_left_l

    const topLine = new Line().init(m_left_f, m_right_f)
    const rightLine = new Line().init(m_right_f, m_right_l)
    const botLine = new Line().init(m_left_l, m_right_l)
    const leftLine = new Line().init(m_left_f, m_left_l)
    const res = {
        right: new NearestLine(Infinity),
        bottom: {
            // x0, x1, x2, x3 (left-right and right-left)
            //   P1(x1) o----------o P2 (x2)
            p1: new NearestLine(),
            p2: new NearestLine(),
            follow: new NearestLine(),
        },
        left: new NearestLine(Infinity),
    }

    for (const polygon of polygons) {
        const points = polygon.data.points
        const numEdge = points.length
        for (let i = 0; i < numEdge - 1; ++i) {
            const indexLastEdge = (i + 1) % numEdge
            const f_edge = getLocationOnOxy(polygon.location, points[i])
            const l_edge = getLocationOnOxy(polygon.location, points[indexLastEdge])

            bottomNearest(f_edge, l_edge)
            // const d_left = barrierNearest(topLine, leftLine, botLine, f_edge, l_edge, compareLess)
            // const d_right = barrierNearest(topLine, rightLine, botLine, f_edge, l_edge, compareMore)
            // min(res.left, f_edge, l_edge, d_left)
            // min(res.right, f_edge, l_edge, d_right)
        }
    }

    for (const polygon of polygons) {
        const points = polygon.data.points
        const numEdge = points.length
        for (let i = 0; i < numEdge; ++i) {
            const indexLastEdge = (i + 1) % numEdge
            const f_edge = getLocationOnOxy(polygon.location, points[i])
            const l_edge = getLocationOnOxy(polygon.location, points[indexLastEdge])

            const d_left = barrierNearest(
                topLine,
                leftLine,
                botLine,
                f_edge,
                l_edge,
                compareLess,
                compareMoreYFirst,
            )
            const d_right = barrierNearest(
                topLine,
                rightLine,
                botLine,
                f_edge,
                l_edge,
                compareMore,
                compareMoreYLast,
            )
            min(res.left, f_edge, l_edge, d_left)
            min(res.right, f_edge, l_edge, d_right)
        }
    }

    function min(result, f_edge, l_edge, d) {
        if (result.distance > d) {
            result.distance = d
            result.line.first = f_edge
            result.line.last = l_edge
        }
    }

    function bottomNearest(f_edge, l_edge) {
        const axis = 'y'
        const commonAxis = axis === 'y' ? 'x' : 'y'
        const tarLine = new Line().init(f_edge, l_edge)
        const inside = tarLine.isInside(botLine, commonAxis)
        // console.log('Inside: ', inside)
        if (!inside) return
        const distanceF = tarLine.calcDistanceTwoPointOnLineCommonAxis(m_bottom_f, axis)
        const distanceL = tarLine.calcDistanceTwoPointOnLineCommonAxis(m_bottom_l, axis)

        // f_edge o ------------ I o --------- l_edge, I = (Math.min(f_edge.x))
        const intersectionPoint = tarLine.calcIntersectionPoint(botLine)
        // intersectionPoint && console.log('point: ', f_edge, l_edge)
        if (
            intersectionPoint &&
            typeof intersectionPoint === 'number' &&
            !Number.isFinite(intersectionPoint)
        )
            max(res.bottom.follow, 0, true)
        else {
            const e_f = new Point(f_edge.x, botLine.findYFromX(f_edge.x))
            const midX = Math.abs(f_edge.x + l_edge.x) / 2
            const e_mid_f = new Point(midX, botLine.findYFromX(midX))
            const e_l = new Point(l_edge.x, botLine.findYFromX(l_edge.x))
            const d_e_f = tarLine.calcDistanceTwoPointOnLineCommonAxis(e_f, axis)
            const d_e_mid_f = tarLine.calcDistanceTwoPointOnLineCommonAxis(e_mid_f, axis)
            const d_e_l = tarLine.calcDistanceTwoPointOnLineCommonAxis(e_l, axis)
            const d = Math.max(convert(d_e_f), convert(d_e_mid_f), convert(d_e_l))
            max(res.bottom.follow, d)
        }

        max(res.bottom.p1, distanceF)
        max(res.bottom.p2, distanceL)

        function max(target, distance, force) {
            // distance is not finite and must be negative number
            // console.log('Target: ', target, ', new distance: ', distance)
            if (!Number.isFinite(distance) || distance > 0) return
            if (force || target.distance < distance) {
                target.distance = distance
                target.line.first = f_edge
                target.line.last = l_edge
            }
        }

        function convert(d) {
            if (d > CONSTANTS.numError) return -Infinity
            if (d > 0 && d < CONSTANTS.numError) return -d
            return d
        }
    }

    function barrierNearest(
        topLine,
        midLine,
        botLine,
        f_edge,
        l_edge,
        callbackCompare,
        callbackCompareY,
    ) {
        const axis = 'x'
        let topDistance = Infinity
        let botDistance = Infinity
        let midDistance = Infinity
        const tarLine = new Line().init(f_edge, l_edge)
        const intersection_top_and_tar = topLine.calcIntersectionPoint(tarLine)
        topDistance = calcDistance(
            intersection_top_and_tar,
            topLine,
            tarLine,
            callbackCompare,
            axis,
        )
        // const intersection_mid_and_tar = calcIntersectionPoint(
        //     f_edge,
        //     l_edge,
        //     midLine.first,
        //     midLine.last,
        // )
        // midDistance = calcDistance(intersection_mid_and_tar, midLine, tarLine, callbackCompare, axis)

        if (
            !f_edge.overlap(botLine.first) &&
            !f_edge.overlap(botLine.last) &&
            !l_edge.overlap(botLine.first) &&
            !l_edge.overlap(botLine.last)
        ) {
            const intersection_bot_and_tar = botLine.calcIntersectionPoint(tarLine)
            botDistance = calcDistance(
                intersection_bot_and_tar,
                botLine,
                tarLine,
                callbackCompare,
                axis,
            )
            if (!callbackCompareY(intersection_bot_and_tar, botLine)) botDistance = Infinity
            f_edge.x == 280 &&
                l_edge == 280 &&
                console.log(topDistance, botDistance, intersection_bot_and_tar)
        }

        // if (f_edge.x === 149 && l_edge.x === 148.2) {
        //     console.log(topDistance, botDistance, intersection_top_and_tar, b)
        // }
        // if (f_edge.x === 109.93 && l_edge.x === 111.53) {
        //     console.log('109.93, 111.53', topDistance, botDistance, intersection_top_and_tar, b)
        // }

        return Math.min(topDistance, botDistance, midDistance)

        function calcDistance(intersectionPoint, main_line, tarLine, callbackCompare, axis) {
            if (intersectionPoint && typeof intersectionPoint !== 'number') {
                if (!callbackCompare(intersectionPoint, main_line)) return Infinity
                const commonAxis = axis === 'x' ? 'y' : 'x'
                const inside = tarLine.isPointInsideAvoidTwoHead(intersectionPoint, commonAxis)
                if (inside) {
                    const distanceF = main_line.first.calcDistanceToPoint(intersectionPoint)
                    const distanceL = main_line.last.calcDistanceToPoint(intersectionPoint)
                    return Math.min(distanceF, distanceL)
                }
            }

            return Infinity
        }
    }

    function compareLess(point, line) {
        return point.x <= line.first.x
    }

    function compareMore(point, line) {
        return point.x > line.first.x
    }

    function compareMoreYFirst(point, line) {
        if (!point) return false
        return true
        return point.y > line.first.y
    }

    function compareMoreYLast(point, line) {
        if (!point) return false
        return true
        return point.y > line.last.y
    }

    return res
}

function checkIntersectionBulletAndObj({ angle, v0, forceWind }, shape_players, polygons) {
    const equationBullet = getEquationBullet({ angle, vo, forceWind })
}

//   h
// ______ 1 2
// |	|
// |	| w
// |	|
// ______ 4 3
// x: left-top: 1, right-top: 2, right-bottom: 3, left-bottom: 4
function createShapePlayer(x3, y3, angle) {
    // create shape on 90deg
    const height = configGame.person.height
    const width = configGame.person.width
    const shape = [
        { x: x3 - height, y: -(y3 - width) },
        { x: x3, y: -(y3 - width) },
        { x: x3, y: -y3 },
        { x: x3 - height, y: -y3 },
    ]

    directionVector(shape[2], shape[0], angle)
    directionVector(shape[2], shape[1], angle)
    directionVector(shape[2], shape[3], angle)
    return shape
}

function newPointFromPointAndVector(point, vectorU) {
    const vectorN = { a: -vectorU.b, b: vectorU.a }
    if (vectorN.b === 0)
        return {
            x: point.x,
            y: point.y - 50,
        }
    if (vectorN.a === 0)
        return {
            x: point.x + 50,
            y: point.y,
        }
    const a = -vectorN.a / vectorN.b
    const b = (vectorN.a * point.x + vectorN.b * point.y) / vectorN.b
    const newY = point.y - 50
    return {
        x: (a * point.x - b * (newY - point.y)) / a,
        y: newY,
    }
}

function directionVector(p_center, p_direct, angle) {
    const v = {
        x: p_direct.x - p_center.x,
        y: p_direct.y - p_center.y,
    }

    const angleRad = convertDegToRad(angle)
    p_direct.x = p_center.x + v.x * Math.cos(angleRad) + v.y * Math.sin(angleRad)
    p_direct.y = p_center.y - v.x * Math.sin(angleRad) + v.y * Math.cos(angleRad)
}

module.exports = {
    getLocationOnOxy,
    nearestNeighborPolygon,
    createShapePlayer,
    directionVector,
}

// function isPointInPolygon(point, vertices) {
//     const numVertices = vertices.length
//     let intersections = 0

//     for (let i = 0; i < numVertices; i++) {
//         const indexLastPoint = (i + 1) % numVertices
//         const f_point = vertices[i]
//         const l_point = vertices[indexLastPoint]

//         if (
//             (f_point.y <= point.y && point.y < l_point.y) ||
//             (l_point.y <= point.y && point.y < f_point.y)
//         ) {
//             if (
//                 point.x <
//                 ((l_point.x - f_point.x) * (point.y - f_point.y)) / (l_point.y - f_point.y) +
//                     f_point.x
//             )
//                 intersections += 1
//         }
//     }

//     return intersections % 2 === 1
// }

// // distance ⊥
// function calculateDistanceToEdge(point, f_edge, l_edge) {
//     const a = f_edge.y - l_edge.y
//     const b = l_edge.x - f_edge.x
//     const c = f_edge.x * l_edge.y - l_edge.x * f_edge.y
//     const numerator = Math.abs(a * point.x + b * point.y + c)
//     const denominator = Math.sqrt(a ** 2 + b ** 2)
//     // console.log(point, ', ', f_edge, ', ', l_edge, ', distance: ', numerator / denominator)

//     return numerator / denominator
// }

// function is3PointOnCommonLine(p1, p2, p3) {
//     // v12.x / v13.x = v12.y / v13.y <=> v12.x * v13.y = v12.y * v13.x | k = v13.x / v12.x => v13.y / v12.y = k
//     const point1 = new Point(p1.x, p1.y)
//     if (point1.overlap(p2) || point1.overlap(p3)) return true
//     const l1 = new Line().init(p1, p2)
//     const l2 = new Line().init(p1, p3)
//     const v12 = l1.createVector()
//     const v13 = l2.createVector()
//     const k = v13.x / v12.x
//     const kq = v13.y - v12.y * k

//     return Math.abs(kq) < 1e-8
// }

// function pointOverlap(p1, p2) {
//     return p1.x === p2.x && p1.y === p2.y
// }

// function createVector(p1, p2) {
//     return {
//         x: p2.x - p1.x,
//         y: p2.y - p1.y,
//     }
// }

// //  true RightAngle | => newAngle = v + g = v + arctan(rightAngle_l_p / rightAngle_f_p)
// //      |\
// //      |v\	v=90			v = 0
// // f_p o\---|o  rightAngle   o---/o l_p
// //       \g |       |	     |  /
// //        \ |       |	     |g/
// //         \|o l_p  |  f_p  o|/
// function calculateAngle(f_p, l_p) {
//     /**
//      *     | => 0deg     ___________ => 90deg     A\--| C(xB, yA)   C(xA, yB)|--/B
//      *     |                                        \ |                      | /
//      *     |                                         \|B                    A|/
//      */
//     if (f_p.x === l_p.x) return 0
//     if (f_p.y === l_p.y) return 90
//     const rightAngle = {
//         x: f_p.x,
//         y: l_p.y,
//     }
//     let tempAngle = 0

//     if (f_p.y > l_p.y) {
//         rightAngle.x = l_p.x
//         rightAngle.y = f_p.y
//         tempAngle = 90
//     }

//     const lineNear = Math.sqrt((f_p.x - rightAngle.x) ** 2 + (f_p.y - rightAngle.y) ** 2)
//     const lineFront = Math.sqrt((l_p.x - rightAngle.x) ** 2 + (l_p.y - rightAngle.y) ** 2)

//     const newAngle = convertRadToDeg(Math.atan(lineFront / lineNear))
//     return tempAngle + newAngle
// }

// function calcIntersectionPoint(l_1_p1, l_1_p2, l_2_p1, l_2_p2) {
//     const line1 = createVariableLine(l_1_p1, l_1_p2)
//     const line2 = createVariableLine(l_2_p1, l_2_p2)

//     if (line1.a === line2.a && line1.b === line2.b) return Infinity
//     if (!line1.isYExist) {
//         if (!line2.isYExist) {
//             return null
//         }
//         const x = -line1.b / line1.a
//         return { x, y: line2.a * x + line2.b }
//     }
//     if (!line2.isYExist) {
//         // <=> line1.isYExist && !line2.isYExist
//         const x = -line2.b / line2.a
//         if (!Number.isFinite(x)) return x
//         return { x, y: line1.a * x + line1.b }
//     }
//     if (line1.a === line2.a) return null
//     const x = (line2.b - line1.b) / (line1.a - line2.a)
//     return { x, y: line1.a * x + line1.b }
// }

// function createVariableLine(p1, p2) {
//     // y = ax + b | ax + b = 0
//     let a = -(p1.y - p2.y)
//     let b = -(p1.x * p2.y - p1.y * p2.x)
//     const coefficient = p2.x - p1.x
//     const isYExist = coefficient !== 0
//     if (isYExist) {
//         a /= coefficient
//         b /= coefficient
//     }
//     return { a, b, isYExist }
// }

// function checkPointInside(point, firstPoint, lastPoint, axis) {
//     const valuePoint = point[axis]
//     const f = firstPoint[axis]
//     const l = lastPoint[axis]
//     return !(valuePoint > f && valuePoint > l) && !(valuePoint < f && valuePoint < l)
// }

// function checkPointInsideAvoidTwoHead(point, firstPoint, lastPoint, axis) {
//     const valuePoint = point[axis]
//     const f = firstPoint[axis]
//     const l = lastPoint[axis]
//     return !(valuePoint >= f && valuePoint >= l) && !(valuePoint <= f && valuePoint <= l)
// }

// function findXFromYInStraightLine(y, point1, point2) {
//     // console.log('Data received: ', x, ", ", point1, ', ', point2)
//     return (-(point2.x - point1.x) * (y - point1.y)) / (point1.y - point2.y) + point1.x
// }

// function findYFromXInStraightLine(x, point1, point2) {
//     // console.log('Data received: ', x, ", ", point1, ', ', point2)
//     return (-(point1.y - point2.y) * (x - point1.x)) / (point2.x - point1.x) + point1.y
// }

// function checkInside(main_f_point, main_l_point, polygon_f_point, polygon_l_point, axis) {
//     /** Check main_f and main_l points inside space area of polygon, by axis.
//      * |	main_f			|
//      * |			main_l	|
//      * |					|
//      * polygon_f_point  polygon_l_point
//      */
//     // cách 1 -> bug
//     // const m_f_inside = checkPointInside(main_f_point, polygon_f_point, polygon_l_point, axis)
//     // const m_l_inside = checkPointInside(main_l_point, polygon_f_point, polygon_l_point, axis)
//     // return m_f_inside && m_l_inside
//     // cách 2
//     const m_f = main_f_point[axis]
//     const m_l = main_l_point[axis]
//     const p_f = polygon_f_point[axis]
//     const p_l = polygon_l_point[axis]

//     const twoPointAreAllLarger = m_f > p_f && m_l > p_f && m_f > p_l && m_l > p_l
//     const twoPointAreAllSmaller = m_f < p_f && m_l < p_f && m_f < p_l && m_l < p_l
//     return !twoPointAreAllSmaller && !twoPointAreAllLarger // or !(twoPointAreAllSmaller || twoPointAreAllLarger)
// }
