const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestArticle('baseball_new11', 'cat video', 'cute', {
        video: {
            path: './cat.mp4' /** or Buffer */,
            comment: 'cute cat video!',
            // canDownload: false
        }
    });
    console.log(res);
})()