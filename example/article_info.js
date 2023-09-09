const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestArticleInfo('baseball_new11', 5) /** response t_vch1가 I면 아이폰 공앱, S면 운영자, A면 안드로이드 공앱, W면 웹, V면 모바일 웹 */
    console.log(res);
})()