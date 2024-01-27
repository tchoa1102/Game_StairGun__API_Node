"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = __importDefault(require("./line"));
const point_1 = __importDefault(require("./point"));
class Circle {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }
    isPolygonCollision(polygon) {
        const res = {
            isCollection: false,
            distance: Infinity,
        };
        const numEdge = polygon.length;
        for (let i = 0; i < numEdge; i++) {
            const f_edge = polygon[i];
            const l_edge = polygon[Math.floor((i + 1) / numEdge)];
            const line = new line_1.default().init(f_edge, l_edge);
            // console.log(line)
            const edge = line.createVector();
            const lineCenterToFEdge = new line_1.default().init(f_edge, this.center);
            const diff = lineCenterToFEdge.createVector();
            /** a1 = projection
             *  a1 = a.b.b/|b|^2 = unidirectionalProj.b/|b| (b/|b| => vector don vi)
             * https://mathworld.wolfram.com/Projection.html
             * https://k12.libretexts.org/Bookshelves/Mathematics/Precalculus/07%3A_Vectors/7.05%3A_Vector_Projection
             *
             *              /l
             *     C o\----/   +
             *         \  /    | proj(ba)
             *          \/f    +
             * */
            // set unidirectProj = a.b/|b|^2 = unidirectionalProj.|b|
            const unidirectProj = (diff.x * edge.x + diff.y * edge.y) / line.distance() ** 2;
            /** => projection = unidirectProj.b
             *  (closest_x-f_x, closest_y-f_y) = unidirectProj.b = (b_x * unidirectProj, b_y * unidirectProj)
             * */
            const closest = new point_1.default(f_edge.x + unidirectProj * edge.x, f_edge.y + unidirectProj * edge.y);
            const projLine = new line_1.default().init(this.center, closest);
            // Tính khoảng cách giữa điểm chiếu và tâm hình tròn
            res.distance = projLine.distance();
            if (unidirectProj >= 0 &&
                unidirectProj <= 1 &&
                res.distance <= this.radius &&
                inside(closest, f_edge, l_edge)) {
                res.isCollection = true;
                break;
            }
        }
        return res;
        function inside(p, f_e, l_e) {
            const insideX = (f_e.x >= p.x && p.x >= l_e.x) || (l_e.x >= p.x && p.x >= f_e.x);
            const insideY = (f_e.y >= p.y && p.y >= l_e.y) || (l_e.y >= p.y && p.y >= f_e.y);
            return insideX && insideY;
        }
    }
}
exports.default = Circle;
