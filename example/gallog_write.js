const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestGuestbookWrite('rofxhdfud' /** 유저 아이디 */, '안녕하세요', false /** 비밀 방명록 (기본 false) */);
    console.log(res);
})()