import User from "./src/OneUser";
import { testAccount } from "./src/TestAccount";

import { allUsers } from "./src/users";

import * as path from 'path';


import * as fsExtra from 'fs-extra';
import { testUsers } from "./src/TestUser";


let users = []

// testAccount.length

let userPromises: Array<any> = [];


// let user = new User({
// 	"mobile": "88902879",
// 	"pwd": "123456",
// 	"account": "88902879",
// 	"mobileCode": "+86",
// 	"devide": 3
// } as any);
// user.login(0);

//创建三万个中户
async function createFun() {

    let startNo: number = 18900000000;
    let Nos: Array<any> = [];
    for (let i = 0; i < 30000; i++) {
        Nos.push({ mobile: (startNo + i).toString(), pwd: '123456', name: (i) + '', validateNum: '000', headUrl: '', account: (startNo + i) + '', device: 1, mobileCode: '+86' })
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


    let file = path.join(__dirname, '/users.json')
    fsExtra.outputFile(file, JSON.stringify(Nos), function (err) {
        if (err) {
            console.log(err)
        }
    })

    // return createUsers;
}

// createFun().then(v => console.log(v, '----------')
// );


function testAccountFun() {
    Promise.all(
        testAccount.filter((item, index) => {
        return index < 2000;
    })
    // allUsers.filter((item, index) => {
    //     return index < 10// allUsers.length;
    // })
    .map((item: any, index: number) => {
        // testUsers.map((item: any, index: number) => {
        // if (index < 800) {
        let temp = testAccount[testAccount.length-1-index]

        return new Promise((resolve, rejects) => {
            setTimeout(async () => {
                let user = new User(temp as any);
                let userData = await user.login(index);
                resolve({ user, ready: userData });
            }, index * 300, temp);
        })


        // }
    }))
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



