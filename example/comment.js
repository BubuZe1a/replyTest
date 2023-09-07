const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestComment('baseball_new11', 1 /** 글 번호 */, '탄핵', 2 /** 답글 달시 번호 (없으면 그냥 댓글) */);
    console.log(res);
})()