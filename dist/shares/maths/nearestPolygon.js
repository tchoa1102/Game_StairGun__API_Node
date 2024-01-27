"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = __importDefault(require("./line"));
class NearestPolygon {
    constructor() {
        this.polygon = null;
        this.line = new line_1.default();
        this.distance = Infinity;
    }
}
exports.default = NearestPolygon;
