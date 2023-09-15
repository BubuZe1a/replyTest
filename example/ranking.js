const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestRankingMajor();
    console.log(res);
})(); // 정갤 랭킹

(async function () {
    const res = await client.requestRankingMinor();
    console.log(res);
})(); // 마갤 랭킹

(async function () {
    const res = await client.requestRankingMini();
    console.log(res);
})(); // 미갤 랭킹