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
var RabbitOnMemory_1 = __importDefault(require("./RabbitOnMemory"));
var RabbitOnMemoryWrapper_1 = require("./RabbitOnMemoryWrapper");
/**
 *
 * Publish a message in an exchange route. All the subscriber with valid binding keys
 * will be called with the payload.
 * @param {string} exchange
 * @param {string} routingKey
 * @param {Buffer} content
 * @param {IPublishOptions} [options]
 * @return {Promise<void>}
 */
var publish = function (exchange, routingKey, content, options) { return __awaiter(void 0, void 0, void 0, function () {
    var rabbitInstance;
    return __generator(this, function (_a) {
        rabbitInstance = RabbitOnMemory_1.default.getInstance();
        return [2 /*return*/, rabbitInstance.publishRoute(exchange, routingKey, content, options)];
    });
}); };
/**
 *
 * Creates a queue binded to a route in one exchange. It is lazy created, so if
 * queue not exists, it will be created in this moment
 * @param {string} exchange
 * @param {IExchangeType} exchangeType
 * @param {string} queue
 * @param {string} bindRoute
 * @param {(msg: IMessage) => Promise<void>} callback
 * @param {IQueueBinding} [options]
 */
var subscribe = function (exchange, exchangeType, queue, bindRoute, callback, options) {
    var rabbitInstance = RabbitOnMemory_1.default.getInstance();
    rabbitInstance.bindQueue(exchange, exchangeType, queue, bindRoute, callback, options);
};
/**
 * Unsubscribe from a queue
 * @param {string} exchange
 * @param {string} queue
 */
var unsubscribe = function (exchange, queue) {
    var rabbitInstance = RabbitOnMemory_1.default.getInstance();
    rabbitInstance.unbindQueue(exchange, queue);
};
/**
 * Configure behavior of the events
 * @param {IConfigOptions} options
 */
var setConfig = function (options) {
    var rabbitInstance = RabbitOnMemory_1.default.getInstance();
    rabbitInstance.setConfig(options);
};
exports.default = {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    setConfig: setConfig,
    init: function () {
        return new RabbitOnMemoryWrapper_1.RabbitOnMemoryWrapper();
    }
};
//# sourceMappingURL=index.js.map