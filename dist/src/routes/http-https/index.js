"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_router_1 = __importDefault(require("./room.router"));
const card_route_1 = __importDefault(require("./card.route"));
const item_route_1 = __importDefault(require("./item.route"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const controllers_1 = require("../../app/controllers");
function routes(app) {
    // app.use
    app.use('/api', middlewares_1.default.decodeToken, middlewares_1.default.findUser);
    app.get('/api/auth/login', (req, res, next) => {
        return res.json({ message: 'Success logging' });
    });
    app.use('/api/rooms', room_router_1.default);
    app.use('/api/auth/load', controllers_1.AuthController.load);
    app.use('/api/cards', card_route_1.default);
    app.use('/api/items', item_route_1.default);
    // app.use('/api/matches/:match/stair', stair)
    // app.use('/api/matches', match)
}
exports.default = routes;
