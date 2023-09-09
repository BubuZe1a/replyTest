const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestCommentList('baseball_new11', 5, 1 /** 페이지 */);
    console.log(res);
})()