const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234,
    captcha: true // 캡챠가 없는 갤러리일시 인식되는 문자 없음
});

(async function () {
    const res = await client.requestArticle('baseball_new11', '제목', '내용 test');
    console.log(res);
})() // 글쓰기 캡챠 우회

(async function () {
    const res = await client.requestVote('baseball_new11', 5)
    console.log(res);
})() // 개추/비추 캡챠 우회

(async function () {
    const res = await client.requestVote('baseball_new11', 5, '우회')
    console.log(res);
})() // 댓글 쓰기 캡챠 우회