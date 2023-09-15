const { DcinsideApi } = require('node-dcinside');

(async function () {
    const res = await DcinsideApi.requestRankingMajor();
    console.log(res);
})(); // 정갤 랭킹

(async function () {
    const res = await DcinsideApi.requestRankingMinor();
    console.log(res);
})(); // 마갤 랭킹

(async function () {
    const res = await DcinsideApi.requestRankingMini();
    console.log(res);
})(); // 미갤 랭킹