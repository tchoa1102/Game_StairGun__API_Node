"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = exports.CardController = exports.RoomController = exports.AuthController = exports.MatchController = exports.StairGameController = void 0;
var stairGame_controller_1 = require("./stairGame.controller");
Object.defineProperty(exports, "StairGameController", { enumerable: true, get: function () { return __importDefault(stairGame_controller_1).default; } });
var match_controller_1 = require("./match.controller");
Object.defineProperty(exports, "MatchController", { enumerable: true, get: function () { return __importDefault(match_controller_1).default; } });
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var room_controller_1 = require("./room.controller");
Object.defineProperty(exports, "RoomController", { enumerable: true, get: function () { return __importDefault(room_controller_1).default; } });
var card_controller_1 = require("./card.controller");
Object.defineProperty(exports, "CardController", { enumerable: true, get: function () { return __importDefault(card_controller_1).default; } });
var item_controller_1 = require("./item.controller");
Object.defineProperty(exports, "ItemController", { enumerable: true, get: function () { return __importDefault(item_controller_1).default; } });
