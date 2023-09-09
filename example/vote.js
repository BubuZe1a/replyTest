const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestVote('baseball_new11', 5, true) /** true면 개추 false면 비추 (기본 개추) */
    console.log(res);
})()