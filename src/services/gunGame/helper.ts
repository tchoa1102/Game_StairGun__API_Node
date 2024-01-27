import configGame from '../../gameConfig.json'
import Point from '../../shares/maths/point'
import Line from '../../shares/maths/line'
import NearestLine from '../../shares/maths/nearestLine'

const CONSTANTS = {
    numError: 1e-8,
}

export function getLocationOnOxy(location: any, point: any) {
    return new Point(point.x + location.x, -(point.y + Math.abs(location.y)))
}

export function nearestNeighborPolygon(main_shape: Array<Point>, polygons: Array<Point>) {
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

    for (const pDefault of polygons) {
        const polygon: any = pDefault
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

    for (const pDefault of polygons) {
        const polygon: any = pDefault
        const points = polygon.data.points
        const numEdge = points.length
        for (let i = 0; i < numEdge; ++i) {
            const indexLastEdge = (i + 1) % numEdge
            const f_edge = getLocationOnOxy(polygon.location, points[i])
            const l_edge = getLocationOnOxy(polygon.location, points[indexLastEdge])

            const d_left = barrierNearest(topLine, leftLine, botLine, f_edge, l_edge, compareLess)
            const d_right = barrierNearest(topLine, rightLine, botLine, f_edge, l_edge, compareMore)
            min(res.left, f_edge, l_edge, d_left)
            min(res.right, f_edge, l_edge, d_right)
        }
    }

    function min(result: any, f_edge: Point, l_edge: Point, d: number) {
        if (result.distance > d) {
            result.distance = d
            result.line.first = f_edge
            result.line.last = l_edge
        }
    }

    function bottomNearest(f_edge: Point, l_edge: Point) {
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

        function max(target: any, distance: number, force?: any) {
            // distance is not finite and must be negative number
            // console.log('Target: ', target, ', new distance: ', distance)
            if (!Number.isFinite(distance) || distance > 0) return
            if (force || target.distance < distance) {
                target.distance = distance
                target.line.first = f_edge
                target.line.last = l_edge
            }
        }

        function convert(d: number) {
            if (d > CONSTANTS.numError) return -Infinity
            if (d > 0 && d < CONSTANTS.numError) return -d
            return d
        }
    }

    function barrierNearest(
        topLine: Line,
        midLine: Line,
        botLine: Line,
        f_edge: Point,
        l_edge: Point,
        callbackCompare: any,
    ) {
        const axis = 'x'
        let topDistance = Infinity
        let botDistance = Infinity
        let midDistance = Infinity
        const tarLine = new Line().init(f_edge, l_edge)
        const intersection_top_and_tar: any = topLine.calcIntersectionPoint(tarLine)
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
            !f_edge.overlap(botLine.first!) &&
            !f_edge.overlap(botLine.last!) &&
            !l_edge.overlap(botLine.first!) &&
            !l_edge.overlap(botLine.last!)
        ) {
            const intersection_bot_and_tar: any = botLine.calcIntersectionPoint(tarLine)
            botDistance = calcDistance(
                intersection_bot_and_tar,
                botLine,
                tarLine,
                callbackCompare,
                axis,
            )
            f_edge.x == 280 &&
                l_edge.x == 280 &&
                console.log(topDistance, botDistance, intersection_bot_and_tar)
        }

        // if (f_edge.x === 149 && l_edge.x === 148.2) {
        //     console.log(topDistance, botDistance, intersection_top_and_tar, b)
        // }
        // if (f_edge.x === 109.93 && l_edge.x === 111.53) {
        //     console.log('109.93, 111.53', topDistance, botDistance, intersection_top_and_tar, b)
        // }

        return Math.min(topDistance, botDistance, midDistance)

        function calcDistance(
            intersectionPoint: Point,
            main_line: Line,
            tarLine: Line,
            callbackCompare: any,
            axis: string,
        ) {
            if (intersectionPoint && typeof intersectionPoint !== 'number') {
                if (!callbackCompare(intersectionPoint, main_line)) return Infinity
                const commonAxis = axis === 'x' ? 'y' : 'x'
                const inside = tarLine.isPointInsideAvoidTwoHead(intersectionPoint, commonAxis)
                if (inside) {
                    const distanceF = main_line.first!.calcDistanceToPoint(intersectionPoint)
                    const distanceL = main_line.last!.calcDistanceToPoint(intersectionPoint)
                    return Math.min(distanceF, distanceL)
                }
            }

            return Infinity
        }
    }

    function compareLess(point: Point, line: Line) {
        return point.x <= line.first!.x
    }

    function compareMore(point: Point, line: Line) {
        return point.x > line.last!.x
    }

    return res
}

//   h
// ______ 1 2
// |	|
// |	| w
// |	|
// ______ 4 3
// x: left-top: 1, right-top: 2, right-bottom: 3, left-bottom: 4
export function createShapePlayer(x3: number, y3: number, angle: number) {
    // create shape on 90deg
    const height = configGame.person.height
    const width = configGame.person.width
    const shape: Array<Point> = [
        new Point(x3 - height, -(y3 - width)),
        new Point(x3, -(y3 - width)),
        new Point(x3, -y3),
        new Point(x3 - height, -y3),
    ]

    new Line().init(shape[2], shape[0]).rotateVector(angle)
    new Line().init(shape[2], shape[1]).rotateVector(angle)
    new Line().init(shape[2], shape[3]).rotateVector(angle)
    return shape
}

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
