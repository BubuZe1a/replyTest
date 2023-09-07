const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestArticle('baseball_new11', 'cat image', '~~cute~~ image', {
        image: './cat.png', /** 여러개면 ['./cat.png', './dog.png'] 형식으로 Buffer 지원 */
    });
    console.log(res);
})()