const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.removeGuestbookWrite('rofxhdfud', 0 /** headnum */);
    console.log(res);
})()