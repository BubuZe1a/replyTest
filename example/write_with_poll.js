const { DcinsideApi } = require('node-dcinside');

const client = new DcinsideApi({
    username: 'ㅇㅇ',
    password: 1234
});

(async function () {
    const res = await client.requestArticle('baseball_new11', '투표', '선거', {
        poll: {
            title: '짜장면좋아하는사람?',
            items: ['싫어요', '좋아요'] /** 20개까지 */,
            // multiSelectLength: 2, /** 복수 선택 개수 */
            // useMultiSelect: true, /** 복수 선택 허용 */
            // usePreview: true, /** 종료 전 미리보기 */
            // onlyGonik: true, /** 고닉만 투표 */
            // notUseEndTime: false, /** 종료 시간 없음 */
            // endTime: '2023-09-16-35-10', /** yyyy-mm-dd-hh-mm 형식으로 */
        }
    });
    console.log(res);
})()