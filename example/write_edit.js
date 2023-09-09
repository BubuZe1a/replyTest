const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestArticleEdit('baseball_new11', 5, '수정된제목', '수정된내용');
    console.log(res);
})()