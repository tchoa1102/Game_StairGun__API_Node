"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameConfig_json_1 = __importDefault(require("../../gameConfig.json"));
const line_1 = __importDefault(require("./line"));
const math_helper_1 = __importDefault(require("./math.helper"));
const parabola_1 = __importDefault(require("./parabola"));
const point_1 = __importDefault(require("./point"));
class Bullet {
    constructor(x0, y0, angle, velocity_0, windForce) {
        /** y↑angle ↗
         *   |৲   ∕
         *   | )∕
         *  O⊥∕---------→x
         */
        const mathConfig = gameConfig_json_1.default.math;
        const rad = math_helper_1.default.degToRad(angle);
        const temp = ((velocity_0 * windForce) / mathConfig.m) * Math.cos(rad); // = x - x_0
        this.location = new point_1.default(x0, y0);
        this.a = -mathConfig.g / (2 * temp ** 2);
        this.b = (mathConfig.g * x0) / temp ** 2 + Math.tan(rad);
        this.c = (-mathConfig.g * x0 ** 2) / (2 * temp ** 2) - x0 * Math.tan(rad) + y0;
        this.parabola = new parabola_1.default(this.a, this.b, this.c);
    }
    findCollision(shape_players, polygons, findRegularCallback) {
        const playerCollisions = shape_players.reduce((total, p) => {
            const numLine = p.length;
            for (let i = 0; i < numLine; ++i) {
                const lastIndex = (i + 1) % numLine;
                const tarLine = new line_1.default().init(p[i], p[lastIndex]);
                const intersection = this.parabola.intersectionWithStraightLine(tarLine);
                if (!intersection)
                    continue;
                total.push(...intersection);
            }
            return total;
        }, []);
        const polygonCollisions = polygons.reduce((total, poly) => {
            const polyPoint = poly.data.points;
            const numLine = polyPoint.length;
            for (let i = 0; i < numLine; ++i) {
                const lastIndex = (i + 1) % numLine;
                const f_edge = getLocationOnOxy(poly.location, polyPoint[i]);
                const l_edge = getLocationOnOxy(poly.location, polyPoint[lastIndex]);
                const tarLine = new line_1.default().init(f_edge, l_edge);
                const intersection = this.parabola.intersectionWithStraightLine(tarLine);
                total.push(...intersection);
            }
            return total;
        }, []);
        // console.log(playerCollisions, polygonCollisions)
        const collision = [...playerCollisions, ...polygonCollisions].reduce((result, collision) => {
            if (findRegularCallback(this.location.x, collision.location.x)) {
                if (!result) {
                    result = collision;
                }
                if (!findRegularCallback(result.location.x, collision.location.x))
                    result = collision;
            }
            return result;
        }, null);
        return collision;
    }
}
function getLocationOnOxy(location, point) {
    return new point_1.default(point.x + location.x, -(point.y + Math.abs(location.y)));
}
exports.default = Bullet;
