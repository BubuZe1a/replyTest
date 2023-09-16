const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestEndPoll('baseball_new1', 62553 /** 글 번호가 아니라 투표 번호 */)
    console.log(res);
})()