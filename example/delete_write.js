const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.removeArticle('baseball_new11', 5 /** 글 번호 */);
    console.log(res);
})()