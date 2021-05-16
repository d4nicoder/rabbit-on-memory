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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = __importDefault(require("os"));
var uuid_1 = require("uuid");
var RabbitOnMemory = /** @class */ (function () {
    function RabbitOnMemory() {
        this.exchanges = new Map();
        this.routes = new Map();
        this.consumerTag = 1;
        this.configuration = {
            syncMode: true,
            debug: false
        };
    }
    RabbitOnMemory.prototype.setExchange = function (name, type) {
        if (this.exchanges.has(name)) {
            return;
        }
        this.exchanges.set(name, type);
    };
    RabbitOnMemory.prototype.runQueuesAsync = function (list, message) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                _loop_1 = function (i) {
                    list[i].callback(message)
                        .then(function () {
                        if (_this.configuration.debug) {
                            console.log("Successful executed event on queue " + list[i].queue + ", route " + list[i].bindRoute);
                        }
                    })
                        .catch(function (e) {
                        console.error(e);
                        console.error("Error executing the queue " + list[i].queue);
                        console.error(message);
                    });
                };
                for (i = 0; i < list.length; i++) {
                    _loop_1(i);
                }
                return [2 /*return*/];
            });
        });
    };
    RabbitOnMemory.prototype.runQueuesSync = function (list, message) {
        return __awaiter(this, void 0, void 0, function () {
            var i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < list.length)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, list[i].callback(message)];
                    case 3:
                        _a.sent();
                        if (this.configuration.debug) {
                            console.log("Successful executed event on queue " + list[i].queue + ", route " + list[i].bindRoute);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        console.error("Error executing the queue " + list[i].queue);
                        console.error(message);
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RabbitOnMemory.prototype.runQueues = function (list, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.configuration.syncMode) {
                    return [2 /*return*/, this.runQueuesSync(list, message)];
                }
                else {
                    return [2 /*return*/, this.runQueuesAsync(list, message)];
                }
                return [2 /*return*/];
            });
        });
    };
    RabbitOnMemory.prototype.processQueuesFanout = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var queues;
            return __generator(this, function (_a) {
                queues = Array.from(this.routes.values()).reduce(function (accum, queues) {
                    return accum.concat(queues.filter(function (queue) { return queue.exchange === message.fields.exchange; }));
                }, []);
                return [2 /*return*/, this.runQueues(queues, message)];
            });
        });
    };
    RabbitOnMemory.prototype.processQueuesDirect = function (route, message) {
        return __awaiter(this, void 0, void 0, function () {
            var queues;
            return __generator(this, function (_a) {
                queues = Array.from(this.routes.entries()).reduce(function (accum, queues) {
                    if (queues[0] === route) {
                        accum = accum.concat(queues[1].filter(function (queue) { return queue.exchange === message.fields.exchange; }));
                    }
                    return accum;
                }, []);
                return [2 /*return*/, this.runQueues(queues, message)];
            });
        });
    };
    RabbitOnMemory.prototype.processQueuesTopic = function (route, message) {
        return __awaiter(this, void 0, void 0, function () {
            var messageSplitedRoute, queues;
            return __generator(this, function (_a) {
                messageSplitedRoute = route.split('.');
                queues = Array.from(this.routes.entries()).reduce(function (accum, queues) {
                    var queuesSplitedRoute = queues[0].split('.');
                    for (var i = 0; i < messageSplitedRoute.length; i++) {
                        if (messageSplitedRoute[i] === queuesSplitedRoute[i]) {
                            // Match
                            continue;
                        }
                        else if (queuesSplitedRoute[i] === '#') {
                            // Match from here to end
                            return accum.concat(queues[1].filter(function (queue) { return queue.exchange === message.fields.exchange; }));
                        }
                        else if (queuesSplitedRoute[i] === '*') {
                            // Match this segment
                            continue;
                        }
                        // No match
                        return accum;
                    }
                    return accum.concat(queues[1].filter(function (queue) { return queue.exchange === message.fields.exchange; }));
                }, []);
                return [2 /*return*/, this.runQueues(queues, message)];
            });
        });
    };
    RabbitOnMemory.getInstance = function () {
        if (!RabbitOnMemory.instance) {
            RabbitOnMemory.instance = new RabbitOnMemory();
        }
        return RabbitOnMemory.instance;
    };
    RabbitOnMemory.prototype.bindQueue = function (options) {
        // Define exchange
        options.exchange = options.exchange || 'default';
        options.exchangeType = options.exchangeType || 'direct';
        this.setExchange(options.exchange, options.exchangeType);
        var queues = this.routes.get(options.bindRoute) || [];
        queues.push(options);
        this.routes.set(options.bindRoute, queues);
        if (this.configuration.debug) {
            console.log("New queue registered:");
            console.log("  - Exchange:     " + options.exchange);
            console.log("  - ExchangeType: " + options.exchangeType);
            console.log("  - Queue:        " + options.queue);
            console.log("  - BindRoute:    " + options.bindRoute);
        }
    };
    RabbitOnMemory.prototype.publishRoute = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var message, exchangeType, error, error;
            return __generator(this, function (_a) {
                options.exchange = options.exchange || 'default';
                options.appId = options.appId || 'default';
                options.contentEncoding = options.contentEncoding || 'none';
                options.contentType = options.contentType || 'application/json';
                options.deliveryMode = options.deliveryMode === 1 || options.deliveryMode === 2 ? options.deliveryMode : 1;
                options.expiration = options.expiration || new Date().toISOString();
                options.headers = options.headers || {};
                options.messageId = options.messageId || uuid_1.v4();
                options.replyTo = options.replyTo || '';
                options.timestamp = Math.floor(Date.now() / 1000);
                options.type = options.type || '';
                options.userId = options.userId || '';
                options.correlationId = options.correlationId || uuid_1.v4();
                message = {
                    fields: {
                        exchange: options.exchange,
                        routingKey: options.route,
                        redelivered: false,
                        consumerTag: String(this.consumerTag++),
                        deliveryTag: 1
                    },
                    properties: {
                        contentType: options.contentType,
                        contentEncoding: options.contentEncoding,
                        headers: options.headers,
                        deliveryMode: options.deliveryMode,
                        priority: 1,
                        correlationId: options.correlationId,
                        replyTo: options.replyTo,
                        expiration: options.expiration,
                        messageId: options.messageId,
                        timestamp: options.timestamp,
                        type: options.type,
                        userId: options.type,
                        appId: options.appId,
                        clusterId: os_1.default.hostname()
                    },
                    content: Buffer.from(options.content),
                };
                exchangeType = this.exchanges.get(options.exchange);
                if (!exchangeType) {
                    error = new Error();
                    error.message = "Exchange " + options.exchange + " not exists";
                    error.name = 'ExchangeNotExists';
                    throw error;
                }
                if (this.configuration.debug) {
                    console.log("New event to send:");
                    console.log(JSON.stringify(message, null, '  '));
                }
                if (exchangeType === 'fanout') {
                    if (this.configuration.debug) {
                        console.log("Publishing in fanout mode");
                    }
                    return [2 /*return*/, this.processQueuesFanout(message)];
                }
                else if (exchangeType === 'direct') {
                    if (this.configuration.debug) {
                        console.log("Publishing in direct mode");
                    }
                    return [2 /*return*/, this.processQueuesDirect(options.route, message)];
                }
                else if (exchangeType === 'topic') {
                    if (this.configuration.debug) {
                        console.log("Publishing in topic mode");
                    }
                    return [2 /*return*/, this.processQueuesTopic(options.route, message)];
                }
                else {
                    error = new Error();
                    error.message = "Exchange type " + exchangeType + " not supported";
                    error.name = 'ExchangeNotSupported';
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    RabbitOnMemory.prototype.setConfig = function (options) {
        if (typeof options.syncMode === 'boolean') {
            this.configuration.syncMode = options.syncMode;
            if (this.configuration.debug) {
                console.log("Events sync mode " + (this.configuration.syncMode ? 'active' : 'disabled'));
            }
        }
        if (typeof options.debug === 'boolean') {
            this.configuration.debug = options.debug;
        }
    };
    return RabbitOnMemory;
}());
exports.default = RabbitOnMemory;
//# sourceMappingURL=RabbitInMemory.js.map