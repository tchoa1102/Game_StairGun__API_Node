"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = __importDefault(require("./line"));
class NearestLine {
    constructor(distanceDefault = -Infinity) {
        this.distance = distanceDefault;
        this.line = new line_1.default();
    }
    copy(newNearestLine) {
        this.distance = newNearestLine.distance;
        this.line.copy(newNearestLine.line);
    }
}
exports.default = NearestLine;
