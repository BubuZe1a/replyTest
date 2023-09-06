const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const fs = require('fs');
const { delay } = require('../utils/delay.js');
const { jx } = require('../utils/decrypt.js');
const {
    BASE_URL,
    GALLOG_BASE_URL,
    WRITE_MAJOR_URL,
    WRITE_MINOR_URL,
    WRITE_MINI_URL,
    VIEW_MAJOR_URL,
    VIEW_MINOR_URL,
    REGIST_VIDEO_URL,
    UPLOAD_VIDEO_URL,
    VIEW_MINI_URL,
    LIST_MAJOR_URL,
    LIST_MINOR_URL,
    LIST_MINI_URL,
    DELETE_MAJOR_URL,
    DELETE_MINOR_URL,
    DELETE_MINI_URL,
    VOTE_URL,
    BLOCK_KEY_URL,
    COMMENT_DELETE_URL,
    COMMENT_POST_URL,
    COMMENT_LIST_URL,
    DCCON_POST_URL,
    POST_URL,
    EDIT_POST_KEY_URL,
    EDIT_POST_URL,
    UPLOAD_BASE_URL,
    M4UP_BASE_URL,
    UPLOAD_IMAGE_URL,
    POST_DELETE_URL,
    HIT_VOTE_URL,
    BEST_VOTE_URL,
    DCCON_LIST_URL
} = require("./constants.js")

const GALL_TYPE = {
    MAJOR: 'G',
    MINOR: 'M',
    MINI: 'MI'
}

const DELAY_TIME = 2000;
const SECRET_PATTERN = /formData \+= "&(.*?)&_GALLTYPE_=/;
const KEY_PATTERN = /_d\('([^']+)'\)/;

class DcinsideApi {
    username;
    password;

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async requestArticle(id, subject, memo, options = {}) {
        const { type, writeUrl } = await this.checkVaildGall(id);

        const { blockKey, rKey, serviceCode, secretKey } = await this.parseWrite(writeUrl);

        const neverKey = jx(secretKey, serviceCode);

        const header = this.generateDefaultHeaders(writeUrl);

        const { data } = await axios({
            method: 'POST',
            url: BLOCK_KEY_URL,
            data: {
                block_key: blockKey,
                r_key: rKey
            },
            headers: header
        });

        await delay(DELAY_TIME);

        const requestConfig = {
            id,
            subject,
            memo,
            name: this.username,
            password: this.password,
            r_key: rKey,
            block_key: data,
            service_code: neverKey,
            _GALLTYPE_: type,
            headtext: '0',
            mode: 'W'
        }

        if (options.image && Array.isArray(options.image) === false) {
            const res = await this.requestUploadImage(id, options.image);

            requestConfig['file_write[0][file_no]'] = res.files[0].file_temp_no;
            requestConfig.memo = `<p><img src="${res.files[0].web2__url || res.files[0].web__url}"></p><br>${memo}`;
            requestConfig.upload_status = 'Y';
        }

        if (options.image && Array.isArray(options.image) === true) {
            requestConfig.memo = '';

            for (let i = 0; i < options.image.length; i++) {
                const res = await this.requestUploadImage(id, options.image[i]);

                requestConfig[`file_write[${i}][file_no]`] = res.files[0].file_temp_no;
                requestConfig.memo += `<p><img src="${res.files[0].web2__url || res.files[0].web__url}"></p><br>`;
                requestConfig.upload_status = 'Y';
            }

            requestConfig.memo += memo
        }

        if (options.video) {
            const res = await this.requestUploadVideo(id, options.video.path);
            const { no } = await this.requestRegistVideo(id, res.thum_url_arr[0], options.video.comment, options.video.canDownload, res.file_no);

            requestConfig.movieIdx = `[[${res.file_no},${no}]]`;
            requestConfig.memo = `<iframe src="https://gall.dcinside.com/board/movie/movie?no=${no}"></iframe>${memo}`;
        }

        const res = await axios({
            method: 'POST',
            url: POST_URL,
            data: requestConfig,
            headers: header
        });

        return res.data;
    }

    async requestArticleEdit(id, no, subject, memo) {
        const { type } = await this.checkVaildGall(id);

        const { data } = await axios({
            method: 'POST',
            url: EDIT_POST_KEY_URL,
            data: {
                id,
                no,
                password: this.password
            },
            headers: this.generateDefaultHeaders()
        });

        const key = data.split('||')[1];

        if (key === 'captcha') throw new Error('Captcha');

        const res = await axios({
            method: 'POST',
            url: EDIT_POST_URL,
            data: {
                id,
                subject,
                memo,
                no,
                key,
                headtext: 0,
                _GALLTYPE_: type
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async removeArticle(id, no) {
        const { type, deleteUrl } = await this.checkVaildGall(id);

        const {
            ci_t,
            dccKey,
            authToken,
            secretKey,
            serviceCode,
            shortKey,
            longKey,
            cur_t,
        } = await this.parseDelete(deleteUrl + `&no=${no}`);

        const neverKey = jx(secretKey, serviceCode);

        const res = await axios({
            method: 'POST',
            url: POST_DELETE_URL,
            data: {
                id,
                no,
                ci_t,
                cur_t,
                password: this.password,
                _GALLTYPE_: type,
                dcc_key: dccKey,
                auth_token: authToken,
                service_code: neverKey,
                [longKey.name]: longKey.value,
                [shortKey.name]: shortKey.value
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async requestComment(id, no, memo, c_no) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const { secretKey, serviceCode } = await this.parseView(viewUrl + `&no=${no}`);

        const neverKey = jx(secretKey, serviceCode);

        const requestConfig = {
            id,
            no,
            memo,
            c_gall_id: id,
            c_gall_no: no,
            _GALLTYPE_: type,
            name: this.username,
            password: this.password,
            service_code: neverKey
        }

        if (c_no) requestConfig.c_no = c_no;

        const res = await axios({
            method: 'POST',
            url: COMMENT_POST_URL,
            data: requestConfig,
            headers: this.generateDefaultHeaders(viewUrl + `&no=${no}`)
        });

        return res.data;
    }

    async removeComment(id, no, re_no) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const res = await axios({
            method: 'POST',
            url: COMMENT_DELETE_URL,
            data: {
                id,
                no,
                re_no,
                mode: 'del',
                _GALLTYPE_: type,
                re_password: this.password,
            },
            headers: this.generateDefaultHeaders(viewUrl + `&no=${no}`)
        });

        return res.data;
    }

    async requestCommentList(id, no, page = 1) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const { e_s_n_o } = await this.parseView(viewUrl + `&no=${no}`);

        const res = await axios({
            method: 'POST',
            url: COMMENT_LIST_URL,
            data: {
                id,
                no,
                e_s_n_o,
                cmt_id: id,
                cmt_no: no,
                comment_page: page,
                _GALLTYPE_: type
            },
            headers: this.generateDefaultHeaders(viewUrl + `&no=${no}`)
        });

        return res.data;
    }

    async requestDccon(id, no, package_idx, detail_idx) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const res = await axios({
            method: 'POST',
            url: DCCON_POST_URL,
            data: {
                id,
                no,
                package_idx,
                detail_idx,
                c_gall_id: id,
                c_gall_no: no,
                check_6: this.generateRandomString(),
                check_7: this.generateRandomString(),
                check_8: this.generateRandomString(),
                name: this.username,
                password: this.password,
                input_type: 'comment',
                _GALLTYPE_: type,
            },
            headers: this.generateDefaultHeaders(viewUrl + `&no=${no}`)
        });

        return res.data;
    }

    async requestDcconList(page = 0) {
        const res = await axios({
            method: 'POST',
            url: DCCON_LIST_URL,
            data: {
                page,
                target: 'icon'
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async requestVote(id, no, isUp = true) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const { ci_t, cookie } = await this.parseView(viewUrl + `&no=${no}`, isUp);

        const res = await axios({
            method: 'POST',
            url: VOTE_URL,
            data: {
                id,
                no,
                ci_t,
                _GALLTYPE_: type,
                mode: isUp ? 'U' : 'D',
                link_id: id,
            },
            headers: {
                ...this.generateDefaultHeaders(viewUrl + `&no=${no}`),
                cookie
            }
        });

        return res.data;
    }

    async requestGuestbookWrite(userid, memo, isSecret = false) {
        await this.checkVaildUser(userid);

        const url = this.getGallogApi(userid, 'write');

        const res = await axios({
            method: 'POST',
            url,
            data: {
                memo,
                is_secret: isSecret ? 1 : 0,
                name: this.username,
                password: this.password,
            },
            headers: this.generateDefaultHeaders(url.split('/ajax')[0])
        });

        return res.data;
    }

    async removeGuestbookWrite(userid, headnum) {
        await this.checkVaildUser(userid);

        const url = this.getGallogApi(userid, 'delete');

        const res = await axios({
            method: 'POST',
            url,
            data: {
                headnum,
                password: this.password
            },
            headers: this.generateDefaultHeaders(url.split('/ajax')[0])
        });

        return res.data;
    }

    async requestUploadImage(id, path) {
        const { type, writeUrl } = await this.checkVaildGall(id);

        const { rKey } = await this.parseWrite(writeUrl);

        const formData = new FormData();

        formData.append('r_key', rKey);
        formData.append('gall_id', id);
        formData.append('_GALLTYPE_', type);
        formData.append('files[]', typeof path === 'object' ? path : fs.readFileSync(path), {
            filename: this.generateRandomString() + '.png'
        });

        const res = await axios({
            method: 'POST',
            url: UPLOAD_IMAGE_URL + id,
            data: formData.getBuffer(),
            headers: formData.getHeaders()
        });

        return res.data;
    }

    async requestUploadVideo(id, path) {
        const { type } = await this.checkVaildGall(id);

        if (type === GALL_TYPE.MINI) 'mi$' + id;

        const formData = new FormData();

        formData.append('id', id);
        formData.append('avatar', typeof path === 'object' ? path : fs.readFileSync(path), {
            filename: this.generateRandomString() + '.mp4'
        });

        const res = await axios({
            method: 'POST',
            url: UPLOAD_VIDEO_URL,
            data: formData.getBuffer(),
            headers: formData.getHeaders()
        });

        return res.data;
    }

    async requestRegistVideo(id, thum_url, comment, canDownload = true, file_no) {
        const { type } = await this.checkVaildGall(id);

        const res = await axios({
            method: 'POST',
            url: REGIST_VIDEO_URL,
            data: {
                thum_url,
                file_no,
                gallery_id: id,
                movie_comment: comment,
                download_y: canDownload ? 1 : 0,
                _GALLTYPE_: type
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async requestHit(id, no) {
        const { type } = await this.checkVaildGall(id);

        const res = await axios({
            method: 'POST',
            url: HIT_VOTE_URL,
            data: {
                gallery_id: id,
                content_no: no,
                _GALLTYPE_: type
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async requestBest(id, no) {
        const { type } = await this.checkVaildGall(id);

        const res = await axios({
            method: 'POST',
            url: BEST_VOTE_URL,
            data: {
                gallery_id: id,
                content_no: no,
                _GALLTYPE_: type
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async checkVaildGall(id) {
        try {
            const res = await axios.get(LIST_MAJOR_URL + id);

            if (res.data.includes('mgallery/')) {
                return { type: GALL_TYPE.MINOR, writeUrl: WRITE_MINOR_URL + id, deleteUrl: DELETE_MINOR_URL + id, viewUrl: VIEW_MINOR_URL + id }
            } else {
                return { type: GALL_TYPE.MAJOR, writeUrl: WRITE_MAJOR_URL + id, deleteUrl: DELETE_MAJOR_URL + id, viewUrl: VIEW_MAJOR_URL + id }
            }
        } catch {
            try {
                await axios.get(LIST_MINI_URL + id);
                return { type: GALL_TYPE.MINI, writeUrl: WRITE_MINI_URL + id, deleteUrl: DELETE_MINI_URL + id, viewUrl: VIEW_MINI_URL + id }
            } catch {
                throw new Error(`존재하지 않는 갤러리입니다 ${id}`)
            }
        }
    }

    async checkVaildUser(userid) {
        try {
            const res = await axios.get(GALLOG_BASE_URL + userid);
            return /<strong class="nick_name">(.*?)<\/strong>/.exec(res.data)[1];
        } catch {
            throw new Error(`유저를 찾을 수 없습니다 ${userid}`)
        }
    }

    async parseWrite(url) {
        const headtextList = [];
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        $('.subject_list li').each(function () {
            headtextList.push({
                [$(this).data('no')]: $(this).text()
            })
        });

        return {
            blockKey: $('#block_key').attr('value'),
            rKey: $('#r_key').attr('value'),
            serviceCode: $('input[name="service_code"]').attr('value'),
            secretKey: res.data.match(KEY_PATTERN)[1],
            headtexts: $('.subject_list li').length > 0 ? headtextList : null,
            useCaptcha: $('.kap_codeimg').length > 0
        };
    }

    async parseView(url, up = true) {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        const params = new URL(url).searchParams;
        const cookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ') + `; ${params.get('id')}${params.get('no')}_${up ? 'Firstcheck' : 'Firstcheck_down'}=Y`;

        return {
            cookie,
            ci_t: cookie.split('ci_c=')[1].split(';')[0],
            e_s_n_o: $('input[name="e_s_n_o"]').attr('value'),
            serviceCode: $('input[name="service_code"]').attr('value'),
            secretKey: res.data.match(KEY_PATTERN)[1],
        };
    }

    async parseDelete(url) {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        return {
            ci_t: $('input[type="hidden"][name="ci_t"]').attr('value'),
            dccKey: $('#dcc_key').attr('value'),
            authToken: $('#auth_token').attr('value'),
            serviceCode: $('input[name="service_code"]').attr('value'),
            cur_t: $('#cur_t').attr('value'),
            longKey: {
                name: $('#delete').contents().eq(9).attr('name'),
                value: $('#delete').contents().eq(9).attr('value'),
            },
            shortKey: {
                name: res.data
                    .match(SECRET_PATTERN)[1]
                    .split('=')[0],
                value: res.data
                    .match(SECRET_PATTERN)[1]
                    .split('=')[1],
            },
            secretKey: res.data.match(KEY_PATTERN)[1],
        };
    }

    getGallogApi(userid, type) {
        switch (type) {
            case 'write':
                return GALLOG_BASE_URL + `${userid}/ajax/guestbook_ajax/${type}`;
            case 'delete':
                return GALLOG_BASE_URL + `${userid}/ajax/guestbook_ajax/${type}`;
            case 'check':
                return GALLOG_BASE_URL + `${userid}/ajax/guestbook_ajax/chk_password`;
        }
    }

    generateRandomString() {
        return (Math.random() + 1).toString(36).substring(2);
    }

    generateDefaultHeaders(url) {
        const header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        }

        if (url) {
            header.Referer = url
        }

        return header;
    }
}

module.exports = {
    DcinsideApi
}
