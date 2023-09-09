const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestDccon('baseball_new11', 5, 114022 /** 디시콘 package id */, 3248425 /** 디시콘 detail id */);
    console.log(res);
})()