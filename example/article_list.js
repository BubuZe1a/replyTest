const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestArticleList('baseball_new11', false /** false면 기본 true면 념글 */, 1 /** 페이지 */);
    console.log(res);
})()
