const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.removeComment('baseball_new11', 5, 15152 /** 댓글 번호 */);
    console.log(res);
})()