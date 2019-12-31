
import io from 'socket.io-client';
// import { socketHost, socketPort } from './config';
import * as  uuid from 'uuid';
// 1.7好整理socket 

export let reconnectFlag: boolean = false;

export default class ChatScoket {

    private connectFun: (() => void) | undefined;
    private disconnectFun: (() => void) | undefined;

    private _chatSocket: SocketIOClient.Socket | undefined;

    private socketHost: string;
    private socketPort: number;
    private token: string;
    private sign: string;

    constructor(_socketHost: string, _socketPort: number, _token: string, _sign: string, _connectFun?: () => void, _disconnectFun?: () => void, _reconnectingFun?: () => void, _reconnectFun?: () => void) {
        this.token = _token;
        this.connectFun = _connectFun;
        this.disconnectFun = _disconnectFun;
        this.socketHost = _socketHost;
        this.socketPort = _socketPort;
        this.sign = _sign;
        this.init();
    }

    /** webSocket */
    public get chatSocket(): SocketIOClient.Socket | undefined {
        return this._chatSocket;
    }


    private init(): void {

        // this._chatSocket = io('http://' + this.socketHost + ':' + this.socketPort + '?token=' + this.token.split('|')[1] + '&device=3&sign=' + this.sign,
        this._chatSocket = io('http://114.116.170.159:9092?token=' + this.token.split('|')[1] + '&device=3&sign=' + this.sign,

       
            { 'forceNew': true, reconnection: true, reconnectionDelay: 10, timeout: 13000 });

        this._chatSocket.on('connect', () => {
            this.connectFun && this.connectFun();
        });
        this._chatSocket.on('disconnect', (reason: any) => {

            (this._chatSocket as any).close();

            this.disconnectFun && this.disconnectFun();
            // console.log('您已经处于离线状态，正在重新连接服务器', reason);
        });
        this._chatSocket.on('error', function (reason: any) {
            console.log('error-----', reason);

        })

        this._chatSocket.on('reconnecting', function () {


            console.info('reconnecting...');//socket重新连接
        });

        this._chatSocket.on('reconnect', function () {


            console.info('reconnect');

        });
        this._chatSocket.on('heart', function (reason: any) {
            console.log('心跳---->>>>{0}', reason);
        })

        this._chatSocket.on('connect_error', function (data: any) {
            console.log(data + ' - connect_error');
        });

        this._chatSocket.on('connect_timeout', function (data: any) {
            console.log(data + ' - connect_timeout');
        });


        this._chatSocket.on('reconnect_attempt', function (data: any) {
            console.log(data + ' - reconnect_attempt');
        });

        this._chatSocket.on('reconnect_error', function (data: any) {
            console.log(data + ' - reconnect_error');
        });
        this._chatSocket.on('reconnect_failed', function (data: any) {
            console.log(data + ' - reconnect_failed');
        });
        this._chatSocket.on('ping', function (data: any) {
            //console.log(data + ' - ping');
        });
        this._chatSocket.on('pong', function (data: any) {
            //console.log(data + ' - pong');
        });

        this._chatSocket.connect();
    }


    public socketClose = (): void => {

        console.log('手动关闭了socket');
        reconnectFlag = false;
        this._chatSocket && this._chatSocket.close();
    }

    sendMsg = (message: ImMessage): Promise<any> => {
        let uuid = message.msgId;
        return new Promise((resolve, reject) => {
            this._chatSocket && (<any>this._chatSocket).emit('chat', message, function (data: any) {
                if (data.code == 1 && data.data.info === uuid) {
                    resolve(message);
                } else {
                    reject('消息发送失败！')
                }
            });
        })

    }

    sendHeardMsg = (message: ImMessage): Promise<any> => {
        let uuid = message.msgId;
        return new Promise((resolve, reject) => {
            // console.log('-----',this._chatSocket );cl

            this._chatSocket && (<any>this._chatSocket).emit('heart', message, function (data: any) {
                if (data.code == 1 && data.data.info == message.fromId) {
                    resolve(message);
                } else {
                    reject('心跳')
                }
            });
        })

    }




    handleMsg = (callback: any) => {

        (<any>this._chatSocket).on('chat', function (data: any, fn: any) {
            console.log(data.content, '<-------收到消息data');

            fn("确认收到消息");
            if (


                data.messageType != 8
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
                && data.messageType != 70

            ) {
                //处理消息
                callback(data);
            }
        });

    }

}


export enum FromType {
	/**
	 * 1：人对人消息
	 */
    P2P = 1,
	/**
	 * 2：群消息
	 */
    P2G,
	/**
	 * 3：系统通知
	 */
    S2P,
	/**
	 * 3：第三方
	 */
    O2P,
}

export interface IUploadFileConfig {
    /**文件名 */
    fileName: string,
    /**文件大小 */
    fileSize: string,
    /**文件路径 */
    fileUrl: string,
    /**文件类型 */
    fileType: string,
    /**是否下载 */
    filished: boolean
}

export enum DevType {
    android = 1,
    ios,
    pc
}

/**
 * 发送消息体
 */
export class ImMessage {

    /** 消息的uuid*/
    readonly msgId: string;

    /** 发送人ID*/
    readonly fromId: number;

    /** 发送源类型 1：人对人消息，2：群消息，3：系统通知，4：第三方*/
    readonly fromType: number;

    /** 收消息人id 如果是发给系统，这里随意设置值，如果是群聊，这里是群id*/
    readonly destId: number;

    /** 发消息人名*/
    readonly fromName: string;

    /** 发送人头像*/
    readonly imageIconUrl: string;

    /** 消息内容 图片、文件、语音消息时。这里为url地址*/
    public content: string | IUploadFileConfig;
	/**
	 * 消息处理结果
	 */
    public resolveResult: string | undefined;
    /**消息名字 */

    /**消息名字 */
    readonly messageType: number;
    /**群名称 */
    readonly ext: string | undefined;

    /** 设备类型 1：安卓，2：ios，3：pc*/
    readonly devType: number;

    readonly sendTime: number;
    isRead: boolean = false;

    constructor(fromId: number, fromType: number, destId: number, fromName: string, imageIconUrl: string, content: string, messageType: number, isRead?: boolean, sendTime: number = 1000) {
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
