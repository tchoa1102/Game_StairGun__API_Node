"use strict";
// const Line = require('./line')
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    copy(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }
    getAxis(axis) {
        if (axis === 'x')
            return this.x;
        return this.y;
    }
    calcDistanceToPoint(p) {
        return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2);
    }
    overlap(p) {
        return this.x === p.x && this.y === p.y;
    }
    newPointFromPointAndVector(vectorU) {
        const vectorN = { a: -vectorU.b, b: vectorU.a };
        if (vectorN.b === 0)
            return {
                x: this.x,
                y: this.y - 50,
            };
        if (vectorN.a === 0)
            return {
                x: this.x + 50,
                y: this.y,
            };
        const a = -vectorN.a / vectorN.b;
        const b = (vectorN.a * this.x + vectorN.b * this.y) / vectorN.b;
        const newY = this.y - 50;
        return new Point((a * this.x - b * (newY - this.y)) / a, newY);
    }
    isPointInPolygon(point, vertices) {
        const numVertices = vertices.length;
        let intersections = 0;
        for (let i = 0; i < numVertices; i++) {
            const indexLastPoint = (i + 1) % numVertices;
            const f_point = vertices[i];
            const l_point = vertices[indexLastPoint];
            if ((f_point.y <= point.y && point.y < l_point.y) ||
                (l_point.y <= point.y && point.y < f_point.y)) {
                if (point.x <
                    ((l_point.x - f_point.x) * (point.y - f_point.y)) / (l_point.y - f_point.y) +
                        f_point.x)
                    intersections += 1;
            }
        }
        return intersections % 2 === 1;
    }
}
exports.default = Point;
