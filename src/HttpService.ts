import fetch from 'node-fetch';
import "babel-polyfill";
import { Logger } from './Log';
const URLSearchParams = require('url-search-params');

export default class HttpService {

    constructor() {

    }

    public login(data: { mobile: string, pwd: string, account: string }): Promise<any> {
        return NetService.login(data);
    }

    public ready(data: { token: string }): Promise<any> {
        return NetService.ready(data);
    }

    public requestFriend(data: { destId: number, userId: number } | any): Promise<any> {
        return NetService.requestFriend(data);
    }

    public register(data: { mobile: string, pwd: string, name: string, validateNum: string, headUrl: string, account: string, device: number, mobileCode: string }): Promise<any> {
        return NetService.register(data);
    }

}

class NetService {
    //测试
    // static rootPath: string = 'http://server.kuliao.me/wmsMobile';
    // static rootPath: string = 'http://10.10.10.145/wmsMobile';
    //哇呼
    // static rootPath: string = 'http://10.10.10.145/wmsMobile';
    static rootPath: string = 'http://114.116.170.159:8080/wmsMobile';
    // 139.159.206.251

    // 114.116.170.159:8080
    // static rootPath: string = 'http://139.159.206.251/wmsMobile';

    /**
     * 注册
     * @param data 
     */
    public static register(data: { mobile: string, pwd: string, name: string, validateNum: string, headUrl: string, account: string, device: number, mobileCode: string }): Promise<any> {
        return NetService.fetchData(data as any, '/chat/register');
    }

    /**
     *进入系统前的准备
     */
    public static ready(data: { token: string }): Promise<any> {
        return NetService.fetchData(data as any, '/chat/ready');
    }
    /**
     * 登录
     */
    public static login(data: { mobile: string, pwd: string, account: string }): Promise<any> {
        const params = Object.assign(data, { device: 3 });
        return NetService.fetchData(params as any, '/chat/doLogin');
    }


    /**
     * 申请添加好友
     * destId：目标用户id
     */
    public static requestFriend(data: { destId: number, userId: number } | any): Promise<any> {
        data['destType'] = 1;
        return NetService.fetchData(data as any, '/chat/requestFriend');
    }


    /**获得服务器时间 */
    public static getServerTime(): Promise<any> {
        return NetService.fetchData({}, '/getServerTime');
    }


    private static fetchData(data: any, action: string, options: Object = {}): Promise<any> {
        const params = NetService.getParams(data);
        return fetch(NetService.rootPath + action, Object.assign({
            method: 'post',
            body: params as any
        }, options) ,
        ).then(NetService.checkStatus).then(res => {
            return res.json();
        }).catch(e=>{
            Logger.info("发报格式错,报文发送失败");
        });
    }


    private static getParams(data: any): URLSearchParams {
        let params = new URLSearchParams();
        for (let [key, value] of data) {
            params.append(key, value as any)
        }
        return params;
    }

    private static checkStatus(res: any) {
        if (res.ok) {
            return res;
        } else {
            throw Error(res.statusText);
        }
    }
}

