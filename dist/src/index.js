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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import dotenv
dotenv_1.default.config();
// const keyPath = path.resolve(process.cwd(), '.env')
// if (fs.existsSync(keyPath)) {
//     console.log('[SYS] dotenv is exists!')
//     require(keyPath)
//     console.log('[SYS] Imported env file')
// }
const server_1 = __importDefault(require("./config/server"));
const http_https_1 = __importDefault(require("./routes/http-https"));
const socket_io_2 = __importDefault(require("./routes/socket.io"));
const db_1 = __importDefault(require("./config/db"));
const http_1 = require("http");
const gameConfig_json_1 = __importDefault(require("./gameConfig.json"));
const middlewares_1 = __importDefault(require("./middlewares"));
const controllers_1 = require("./app/controllers");
// #region Server configuration
const optionCORS = {
    origin(requestOrigin, callback) {
        const origins = process.env.ALLOWED_ORIGINS || '';
        const isAllowed = origins.includes(requestOrigin || '');
        if (isAllowed)
            return callback(null, requestOrigin);
        return callback(new Error('Origin is not allowed!'), requestOrigin);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: optionCORS,
});
// #endregion Server configuration
// #region middleware
app.use((0, cors_1.default)(optionCORS));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// #endregion middleware
// #region Routes
app.use((req, res, next) => {
    console.log(`\x1b${gameConfig_json_1.default.colors.bg.green}%s\x1b${gameConfig_json_1.default.colors.reset}`, '->->->->->->->->->-> handling request <-<-<-<-<-<-<-<-<-<-');
    try {
        next();
    }
    catch (error) {
        console.log(error);
    }
    // console.log(
    //     `\x1b${configGame.colors.bg.gray}%s\x1b${configGame.colors.reset}`,
    //     '-x-x-x-x-x- request was handled -x-x-x-x-x-',
    // )
});
app.get('/test/db', controllers_1.ItemController.getAll);
(0, http_https_1.default)(app);
io.use(middlewares_1.default.decodeTokenSocket);
(0, socket_io_2.default)(io);
app.use((error, req, res, next) => {
    console.log(error);
    return res.status(500).json({
        message: 'Có lỗi xảy ra!',
    });
});
// #endregion Routes
// start
function mainFlow() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.connect();
            server.listen(server_1.default.port, () => {
                console.log('[SYS] Listening on port ' + server_1.default.port + '\n[SYS] Welcome to game!\n');
            });
        }
        catch (error) {
            console.log('An error correct: ', error);
        }
    });
}
mainFlow();
