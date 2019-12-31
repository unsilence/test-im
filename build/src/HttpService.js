"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
require("babel-polyfill");
const Log_1 = require("./Log");
const URLSearchParams = require('url-search-params');
class HttpService {
    constructor() {
    }
    login(data) {
        return NetService.login(data);
    }
    ready(data) {
        return NetService.ready(data);
    }
    requestFriend(data) {
        return NetService.requestFriend(data);
    }
    register(data) {
        return NetService.register(data);
    }
}
exports.default = HttpService;
class NetService {
    // 139.159.206.251
    // 114.116.170.159:8080
    // static rootPath: string = 'http://139.159.206.251/wmsMobile';
    /**
     * 注册
     * @param data
     */
    static register(data) {
        return NetService.fetchData(data, '/chat/register');
    }
    /**
     *进入系统前的准备
     */
    static ready(data) {
        return NetService.fetchData(data, '/chat/ready');
    }
    /**
     * 登录
     */
    static login(data) {
        const params = Object.assign(data, { device: 3 });
        return NetService.fetchData(params, '/chat/doLogin');
    }
    /**
     * 申请添加好友
     * destId：目标用户id
     */
    static requestFriend(data) {
        data['destType'] = 1;
        return NetService.fetchData(data, '/chat/requestFriend');
    }
    /**获得服务器时间 */
    static getServerTime() {
        return NetService.fetchData({}, '/getServerTime');
    }
    static fetchData(data, action, options = {}) {
        const params = NetService.getParams(data);
        return node_fetch_1.default(NetService.rootPath + action, Object.assign({
            method: 'post',
            body: params
        }, options)).then(NetService.checkStatus).then(res => {
            return res.json();
        }).catch(e => {
            Log_1.Logger.info("发报格式错,报文发送失败");
        });
    }
    static getParams(data) {
        let params = new URLSearchParams();
        for (let [key, value] of data) {
            params.append(key, value);
        }
        return params;
    }
    static checkStatus(res) {
        if (res.ok) {
            return res;
        }
        else {
            throw Error(res.statusText);
        }
    }
}
//测试
// static rootPath: string = 'http://server.kuliao.me/wmsMobile';
// static rootPath: string = 'http://10.10.10.145/wmsMobile';
//哇呼
// static rootPath: string = 'http://10.10.10.145/wmsMobile';
NetService.rootPath = 'http://114.116.170.159:8080/wmsMobile';
//# sourceMappingURL=HttpService.js.map