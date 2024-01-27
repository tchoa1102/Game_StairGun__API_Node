"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = __importDefault(require("./point"));
const math_helper_1 = __importDefault(require("./math.helper"));
const collision_1 = __importDefault(require("./collision"));
class Parabola {
    constructor(a, b, c) {
        this.a = a || 0;
        this.b = b || 0;
        this.c = c || 0;
    }
    copy(p) {
        this.a = p.a;
        this.b = p.b;
        this.c = p.c;
        return this;
    }
    sumLine(line) {
        // @with line: {a, b}, y = ax + b
        // ax^2 + bx + c = ax + b
        this.b -= line.a;
        this.c -= line.b;
        return this;
    }
    computeY(x) {
        return this.a * x ** 2 + this.b * x + this.c;
    }
    intersectionWithStraightLine(line) {
        const l = line.createVariable();
        const equationL2 = new Parabola().copy(this).sumLine(l);
        const xIntersection = math_helper_1.default.solveEquationLevel2(equationL2);
        if (!xIntersection)
            return [];
        const intersection = xIntersection.reduce((result, x) => {
            const pointInter = new point_1.default(x);
            if (line.isPointInside(pointInter)) {
                const newIntersection = new collision_1.default(pointInter, line);
                result.push(newIntersection);
            }
            return result;
        }, []);
        return intersection;
    }
}
exports.default = Parabola;
