const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234,
    // captcha: true,
    // proxy: {
    //     protocol: 'http',
    //     host: '127.0.0.1',
    //     port: 80
    // },
});

(async function () {
    const res = await client.requestArticle('baseball_new11', '제목', '내용 test', {
        // image: ['./cat.png', './dog.png'],
        // video: {
        //     path: './cat.mp4'
        // },
        // headtext: 0
    });
    console.log(res);
})()