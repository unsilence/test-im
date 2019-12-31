"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const OneUser_1 = __importDefault(require("./src/OneUser"));
const TestAccount_1 = require("./src/TestAccount");
const path = __importStar(require("path"));
const fsExtra = __importStar(require("fs-extra"));
let users = [];
// testAccount.length
let userPromises = [];
// let user = new User({
// 	"mobile": "88902879",
// 	"pwd": "123456",
// 	"account": "88902879",
// 	"mobileCode": "+86",
// 	"devide": 3
// } as any);
// user.login(0);
//创建三万个中户
function createFun() {
    return __awaiter(this, void 0, void 0, function* () {
        let startNo = 18900000000;
        let Nos = [];
        for (let i = 0; i < 30000; i++) {
            Nos.push({ mobile: (startNo + i).toString(), pwd: '123456', name: (i) + '', validateNum: '000', headUrl: '', account: (startNo + i) + '', device: 1, mobileCode: '+86' });
        }
        // let createUsers = await Promise.all(Nos.map((info, index) => {
        //     return new Promise((resolve, rejects) => {
        //         setTimeout(async () => {
        //             let user = new User(info as any);
        //             let userData = await user.register(info as any);
        //             resolve({ user, ready: userData });
        //         }, index * 100, info);
        //     })
        // }))
        // console.log('create user over');
        let file = path.join(__dirname, '/users.json');
        fsExtra.outputFile(file, JSON.stringify(Nos), function (err) {
            if (err) {
                console.log(err);
            }
        });
        // return createUsers;
    });
}
// createFun().then(v => console.log(v, '----------')
// );
function testAccountFun() {
    Promise.all(TestAccount_1.testAccount.filter((item, index) => {
        return index < 2000;
    })
        // allUsers.filter((item, index) => {
        //     return index < 10// allUsers.length;
        // })
        .map((item, index) => {
        // testUsers.map((item: any, index: number) => {
        // if (index < 800) {
        let temp = TestAccount_1.testAccount[TestAccount_1.testAccount.length - 1 - index];
        return new Promise((resolve, rejects) => {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                let user = new OneUser_1.default(temp);
                let userData = yield user.login(index);
                resolve({ user, ready: userData });
            }), index * 300, temp);
        });
        // }
    }));
    // .then(datas => {
    // let usersMap: any = {} as any;
    // datas.forEach((item: any) => {
    //     usersMap[item.ready.myInfo.id] = item;
    // })
    // let ids = Object.keys(usersMap);
    // ids.forEach((id, index) => {
    //     ids.forEach((twoId, twoIndex) => {
    //         if (id != twoId) {
    //             ((datas[twoIndex] as any).user as User).requestFriend({ destId: id, twoId });
    //         }
    //     });
    // });
    // });
}
testAccountFun();
//# sourceMappingURL=index.js.map