"use strict";
// When starting this project by using `npm run dev`, this server script
// will be compiled using tsc and will be running concurrently along side webpack-dev-server
// visit http://127.0.0.1:8080
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// In the production environment we don't use the webpack-dev-server, so instead type,
// `npm run build`        (this creates the production version of bundle.js and places it in ./dist/client/)
// `tsc -p ./src/server`  (this compiles ./src/server/server.ts into ./dist/server/server.js)
// `npm start            (this starts nodejs with express and serves the ./dist/client folder)
// visit http://127.0.0.1:3000
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var port = 3000;
var App = /** @class */ (function () {
    function App(port) {
        var _this = this;
        this.clients = {};
        this.port = port;
        var app = (0, express_1["default"])();
        app.use(express_1["default"].static(path_1["default"].join(__dirname, '../client')));
        console.log("serving static files from " + path_1["default"].join(__dirname, '../client'));
        this.server = new http_1["default"].Server(app);
        this.io = new socket_io_1.Server(this.server);
        this.io.on('connection', function (socket) {
            console.log(socket.constructor.name);
            _this.clients[socket.id] = {};
            console.log(_this.clients);
            console.log('a user connected : ' + socket.id);
            socket.emit('id', socket.id);
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
                if (_this.clients && _this.clients[socket.id]) {
                    console.log('deleting ' + socket.id);
                    delete _this.clients[socket.id];
                    _this.io.emit('removeClient', socket.id);
                }
            });
            socket.on('update', function (message) {
                if (_this.clients[socket.id]) {
                    _this.clients[socket.id].t = message.t; //client timestamp
                    _this.clients[socket.id].p = message.p; //position
                    _this.clients[socket.id].r = message.r; //rotation
                }
            });
        });
        setInterval(function () {
            _this.io.emit('clients', _this.clients);
        }, 50);
    }
    App.prototype.Start = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log("Server listening on port ".concat(_this.port, "."));
        });
    };
    return App;
}());
new App(port).Start();
