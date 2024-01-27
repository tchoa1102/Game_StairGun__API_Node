"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    init(p1, p2) {
        this.x = p2.x - p1.x;
        this.y = p2.y - p1.y;
        return this;
    }
}
exports.default = Vector;
