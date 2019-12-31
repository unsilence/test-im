"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
// import { socketHost, socketPort } from './config';
const uuid = __importStar(require("uuid"));
// 1.7好整理socket 
exports.reconnectFlag = false;
class ChatScoket {
    constructor(_socketHost, _socketPort, _token, _sign, _connectFun, _disconnectFun, _reconnectingFun, _reconnectFun) {
        this.socketClose = () => {
            console.log('手动关闭了socket');
            exports.reconnectFlag = false;
            this._chatSocket && this._chatSocket.close();
        };
        this.sendMsg = (message) => {
            let uuid = message.msgId;
            return new Promise((resolve, reject) => {
                this._chatSocket && this._chatSocket.emit('chat', message, function (data) {
                    if (data.code == 1 && data.data.info === uuid) {
                        resolve(message);
                    }
                    else {
                        reject('消息发送失败！');
                    }
                });
            });
        };
        this.sendHeardMsg = (message) => {
            let uuid = message.msgId;
            return new Promise((resolve, reject) => {
                // console.log('-----',this._chatSocket );cl
                this._chatSocket && this._chatSocket.emit('heart', message, function (data) {
                    if (data.code == 1 && data.data.info == message.fromId) {
                        resolve(message);
                    }
                    else {
                        reject('心跳');
                    }
                });
            });
        };
        this.handleMsg = (callback) => {
            this._chatSocket.on('chat', function (data, fn) {
                console.log(data.content, '<-------收到消息data');
                fn("确认收到消息");
                if (data.messageType != 8
                    && data.messageType != 5
                    && data.messageType != 6
                    // && data.messageType  != 7
                    && data.messageType != 13
                    && data.messageType != 14
                    && data.messageType != 18
                    && data.messageType != 19
                    && data.messageType != 20
                    && data.messageType != 21
                    && data.messageType != 22
                    && data.messageType != 24
                    // && data.messageType  != 25
                    && data.messageType != 26
                    && data.messageType != 27
                    && data.messageType != 31
                    // && data.messageType  != 32
                    && data.messageType != 33
                    && data.messageType != 35
                    && data.messageType != 36
                    && data.messageType != 37
                    && data.messageType != 39
                    && data.messageType != 40
                    && data.messageType != 41
                    && data.messageType != 42
                    && data.messageType != 43
                    && data.messageType != 44
                    && data.messageType != 45
                    && data.messageType != 47
                    && data.messageType != 48
                    && data.messageType != 49
                    && data.messageType != 50
                    && data.messageType != 51
                    && data.messageType != 52
                    && data.messageType != 53
                    // && data.messageType  != 55
                    && data.messageType != 56
                    // && data.messageType  != 57
                    // && data.messageType  != 58
                    // && data.messageType  != 59
                    && data.messageType != 61
                    && data.messageType != 62
                    // && data.messageType  != 63
                    // && data.messageType  != 64
                    && data.messageType != 65
                    && data.messageType != 66
                    // && data.messageType  != 67
                    && data.messageType != 68
                    && data.messageType != 69
                    && data.messageType != 70) {
                    //处理消息
                    callback(data);
                }
            });
        };
        this.token = _token;
        this.connectFun = _connectFun;
        this.disconnectFun = _disconnectFun;
        this.socketHost = _socketHost;
        this.socketPort = _socketPort;
        this.sign = _sign;
        this.init();
    }
    /** webSocket */
    get chatSocket() {
        return this._chatSocket;
    }
    init() {
        // this._chatSocket = io('http://' + this.socketHost + ':' + this.socketPort + '?token=' + this.token.split('|')[1] + '&device=3&sign=' + this.sign,
        this._chatSocket = socket_io_client_1.default('http://114.116.170.159:9092?token=' + this.token.split('|')[1] + '&device=3&sign=' + this.sign, { 'forceNew': true, reconnection: true, reconnectionDelay: 10, timeout: 13000 });
        this._chatSocket.on('connect', () => {
            this.connectFun && this.connectFun();
        });
        this._chatSocket.on('disconnect', (reason) => {
            this._chatSocket.close();
            this.disconnectFun && this.disconnectFun();
            // console.log('您已经处于离线状态，正在重新连接服务器', reason);
        });
        this._chatSocket.on('error', function (reason) {
            console.log('error-----', reason);
        });
        this._chatSocket.on('reconnecting', function () {
            console.info('reconnecting...'); //socket重新连接
        });
        this._chatSocket.on('reconnect', function () {
            console.info('reconnect');
        });
        this._chatSocket.on('heart', function (reason) {
            console.log('心跳---->>>>{0}', reason);
        });
        this._chatSocket.on('connect_error', function (data) {
            console.log(data + ' - connect_error');
        });
        this._chatSocket.on('connect_timeout', function (data) {
            console.log(data + ' - connect_timeout');
        });
        this._chatSocket.on('reconnect_attempt', function (data) {
            console.log(data + ' - reconnect_attempt');
        });
        this._chatSocket.on('reconnect_error', function (data) {
            console.log(data + ' - reconnect_error');
        });
        this._chatSocket.on('reconnect_failed', function (data) {
            console.log(data + ' - reconnect_failed');
        });
        this._chatSocket.on('ping', function (data) {
            //console.log(data + ' - ping');
        });
        this._chatSocket.on('pong', function (data) {
            //console.log(data + ' - pong');
        });
        this._chatSocket.connect();
    }
}
exports.default = ChatScoket;
var FromType;
(function (FromType) {
    /**
     * 1：人对人消息
     */
    FromType[FromType["P2P"] = 1] = "P2P";
    /**
     * 2：群消息
     */
    FromType[FromType["P2G"] = 2] = "P2G";
    /**
     * 3：系统通知
     */
    FromType[FromType["S2P"] = 3] = "S2P";
    /**
     * 3：第三方
     */
    FromType[FromType["O2P"] = 4] = "O2P";
})(FromType = exports.FromType || (exports.FromType = {}));
var DevType;
(function (DevType) {
    DevType[DevType["android"] = 1] = "android";
    DevType[DevType["ios"] = 2] = "ios";
    DevType[DevType["pc"] = 3] = "pc";
})(DevType = exports.DevType || (exports.DevType = {}));
/**
 * 发送消息体
 */
class ImMessage {
    constructor(fromId, fromType, destId, fromName, imageIconUrl, content, messageType, isRead, sendTime = 1000) {
        this.isRead = false;
        this.msgId = uuid.v1();
        this.fromId = fromId;
        this.fromType = fromType;
        this.destId = destId;
        this.fromName = fromName;
        this.imageIconUrl = imageIconUrl;
        this.content = content;
        this.messageType = messageType;
        this.devType = 3;
        this.sendTime = sendTime;
        this.isRead = Boolean(isRead);
    }
}
exports.ImMessage = ImMessage;
//# sourceMappingURL=ChatSocket.js.map