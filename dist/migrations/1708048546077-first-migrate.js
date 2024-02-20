"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
// Import your models here
const models_1 = require("../src/app/models");
const items_json_1 = __importDefault(require("../src/app/basedb/items.json"));
const cards_json_1 = __importDefault(require("../src/app/basedb/cards.json"));
const maps_json_1 = __importDefault(require("../src/app/basedb/maps.json"));
const objects_json_1 = __importDefault(require("../src/app/basedb/objects.json"));
const mongoose_1 = require("mongoose");
const db_1 = __importDefault(require("../src/config/db"));
function up() {
    return __awaiter(this, void 0, void 0, function* () {
        // Write migration here
        try {
            yield db_1.default.connect();
            const items = convert(items_json_1.default);
            const cards = convert(cards_json_1.default);
            const maps = convert(maps_json_1.default);
            const obj = convert(objects_json_1.default);
            yield models_1.ItemModel.create(items);
            yield models_1.CardModel.create(cards);
            yield models_1.MapModel.create(maps);
            yield models_1.ObjectModel.create(obj);
        }
        catch (error) {
            console.log('Error migration: \n', error);
        }
    });
}
exports.up = up;
function down() {
    return __awaiter(this, void 0, void 0, function* () {
        // Write migration here
    });
}
exports.down = down;
function convert(data) {
    return data.map((item) => {
        Array.from(Object.keys(item)).forEach((key) => {
            const value = item[key];
            if (Array.isArray(value)) {
                item[key] = convert(value);
                // array is object
            }
            else if (typeof value === 'object' && value.hasOwnProperty('$oid')) {
                item[key] = new mongoose_1.Types.ObjectId(value.$oid);
            }
        });
        return item;
    });
}
