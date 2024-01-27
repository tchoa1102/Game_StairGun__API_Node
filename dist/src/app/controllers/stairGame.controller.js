"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
class StairGameController {
    // [GET] api/matches/:match/stair
    get(req, res, next) {
        return res.json({ message: 'Welcome to Stair Gun Game' });
    }
}
exports.default = new StairGameController();
