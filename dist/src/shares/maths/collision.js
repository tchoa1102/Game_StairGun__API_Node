"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = __importDefault(require("./point"));
class Collision {
    constructor(point, line) {
        this.location = new point_1.default(point.x, point.y);
        this.line = line;
    }
}
exports.default = Collision;
