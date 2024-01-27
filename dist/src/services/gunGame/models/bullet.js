"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = __importDefault(require("../../../shares/maths/point"));
class BulletState {
    constructor(point, angle) {
        this.point = new point_1.default(point.x, point.y);
        this.angle = angle;
    }
}
exports.default = BulletState;
