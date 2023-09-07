const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234,
    // proxy: {
    //     protocol: 'http',
    //     host: '127.0.0.1',
    //     port: 80
    // }
});

(async function () {
    const res = await client.requestArticle('baseball_new11', 'mardkown', '**bold** test');
    console.log(res);
})()