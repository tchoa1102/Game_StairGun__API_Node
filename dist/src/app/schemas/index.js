"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardOnStairGame = exports.stairSchema = exports.playerOnMainGameSchema = exports.playerSchema = exports.itemSchema = exports.propertySchema = void 0;
var property_schema_1 = require("./property.schema");
Object.defineProperty(exports, "propertySchema", { enumerable: true, get: function () { return __importDefault(property_schema_1).default; } });
var item_schema_1 = require("./item.schema");
Object.defineProperty(exports, "itemSchema", { enumerable: true, get: function () { return __importDefault(item_schema_1).default; } });
var player_schema_1 = require("./player.schema");
Object.defineProperty(exports, "playerSchema", { enumerable: true, get: function () { return __importDefault(player_schema_1).default; } });
var playerOnMainGame_schema_1 = require("./playerOnMainGame.schema");
Object.defineProperty(exports, "playerOnMainGameSchema", { enumerable: true, get: function () { return __importDefault(playerOnMainGame_schema_1).default; } });
var stair_schema_1 = require("./stair.schema");
Object.defineProperty(exports, "stairSchema", { enumerable: true, get: function () { return __importDefault(stair_schema_1).default; } });
var cardOnStairGame_schema_1 = require("./cardOnStairGame.schema");
Object.defineProperty(exports, "cardOnStairGame", { enumerable: true, get: function () { return __importDefault(cardOnStairGame_schema_1).default; } });
