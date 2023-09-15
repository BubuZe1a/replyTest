const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const { delay } = require('../utils/delay.js');
const { jx, xc, kx } = require('../utils/decrypt.js');
const {
    BASE_URL,
    CAPTCHA_SESSION_URL,
    DCCON_INFO_URL,
    GALLOG_BASE_URL,
    IMG2_BASE_URL,
    LIST_POST_URL,
    WRITE_MAJOR_URL,
    WRITE_MINOR_URL,
    RANK_MAJOR_URL,
    RANK_MINI_URL,
    RANK_MINOR_URL,
    WRITE_MINI_URL,
    GET_VIEW_FILE_URL,
    PORN_REPORT_URL,
    GET_VIEW_URL,
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
    DCCON_LIST_URL,
    PAPAGO_OCR_URL,
    CAPTCHA_URL
} = require('./constants.js');
const fs = require('fs');

const GALL_TYPE = {
    MAJOR: 'G',
    MINOR: 'M',
    MINI: 'MI'
}

const DELAY_TIME = 2000;
const SECRET_PATTERN = /formData \+= "&(.*?)&_GALLTYPE_=/;
const KEY_PATTERN = /_d\('([^']+)'\)/;

class DcinsideApi {
    constructor(options = {}) {
        this.username = options.username;
        this.password = options.password;
        this.captcha = options.captcha;
        this.axios = axios.create({
            proxy: options.proxy
        });
    }

    setAxios(options = {}) {
        this.axios = axios.create(options);
    }

    async requestArticle(id, subject, memo, options = {}) {
        const { type, writeUrl } = await this.checkVaildGall(id);

        const { blockKey, rKey, serviceCode, secretKey, ci_t, cookie } = await this.parseWrite(writeUrl);

        const neverKey = jx(secretKey, serviceCode);

        const header = this.generateDefaultHeaders(writeUrl);

        const { data } = await this.axios({
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
            headtext: 0,
            mode: 'W'
        }

        if (this.captcha) {
            const { data } = await this.requestCaptchaSession(id, type, 'write', ci_t, cookie);

            const res = await this.requestOcr(data);

            requestConfig.code = res.ocrs[0].text.toLowerCase();
        }

        if (options.image) {
            if (!Array.isArray(options.image)) {
                const res = await this.requestUploadImage(id, options.image);
                const fileUrl = res.files[0].web2__url || res.files[0].web__url;

                requestConfig['file_write[0][file_no]'] = res.files[0].file_temp_no;
                requestConfig.memo = `<p><img src="${fileUrl}"></p><br>${memo}`;
                requestConfig.upload_status = 'Y';
            } else {
                requestConfig.memo = '';

                for (let i = 0; i < options.image.length; i++) {
                    const res = await this.requestUploadImage(id, options.image[i]);
                    const fileUrl = res.files[0].web2__url || res.files[0].web__url;

                    requestConfig[`file_write[${i}][file_no]`] = res.files[0].file_temp_no;
                    requestConfig.memo += `<p><img src="${fileUrl}"></p><br>`;
                    requestConfig.upload_status = 'Y';
                }

                requestConfig.memo += memo;
            }
        }

        if (options.video) {
            const res = await this.requestUploadVideo(id, options.video.path);
            const { no } = await this.requestRegistVideo(id, res.thum_url_arr[0], options.video.comment, options.video.canDownload, res.file_no);

            requestConfig.movieIdx = `[[${res.file_no},${no}]]`;
            requestConfig.memo = `<iframe src="https://gall.dcinside.com/board/movie/movie?no=${no}"></iframe>${memo}`;
        }

        if (options.headtext) requestConfig.headtext = options.headtext;

        const res = await this.axios({
            method: 'POST',
            url: POST_URL,
            data: requestConfig,
            headers: { ...header, cookie },
        });

        return res.data;
    }

    async requestArticleEdit(id, no, subject, memo) {
        const { type } = await this.checkVaildGall(id);

        const { data } = await this.axios({
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

        const res = await this.axios({
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

    async requestArticleList(id, page = 1) {
        const { type } = await this.checkVaildGall(id);

        if (type === GALL_TYPE.MINI) id = 'mi$' + id;

        const res = await this.axios({
            method: 'POST',
            url: LIST_POST_URL,
            data: {
                id,
                page,
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data.gall_list.data;
    }

    async requestArticleInfo(id, no) {
        const { type, listUrl } = await this.checkVaildGall(id);

        const { ci_t, e_s_n_o, cookie } = await this.parseList(listUrl);

        const res = await this.axios({
            method: 'POST',
            url: GET_VIEW_URL,
            data: {
                id,
                no,
                ci_t,
                e_s_n_o,
                _GALLTYPE_: type
            },
            headers: { ...this.generateDefaultHeaders(), cookie }
        });

        return res.data;
    }

    async requestArticleFiles(id, no) {
        const { type, listUrl } = await this.checkVaildGall(id);

        const { ci_t, e_s_n_o, cookie } = await this.parseList(listUrl);

        const res = await this.axios({
            method: 'POST',
            url: GET_VIEW_FILE_URL,
            data: {
                id,
                no,
                ci_t,
                e_s_n_o,
                _GALLTYPE_: type
            },
            headers: { ...this.generateDefaultHeaders(), cookie }
        });

        if (!res.data) return null;

        const replaceSrc = res.data.map(item => {
            return { ...item, src: IMG2_BASE_URL + decodeURIComponent(item.src).split('no=')[1].split('&')[0] };
        });

        return replaceSrc;
    }

    async requestArticleReportPorn(id, no) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const { ci_t, cookie } = await this.parseView(viewUrl + `&no=${no}`);

        const res = await this.axios({
            method: 'POST',
            url: PORN_REPORT_URL,
            data: {
                id,
                ci_t,
                content_no: no,
                srkey: xc(),
                _GALLTYPE_: type
            },
            headers: { ...this.generateDefaultHeaders(viewUrl + `&no=${no}`), cookie }
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

        const res = await this.axios({
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

        const { secretKey, serviceCode, ci_t, cookie } = await this.parseView(viewUrl + `&no=${no}`);

        const neverKey = jx(secretKey, serviceCode);

        await delay(DELAY_TIME);

        const requestConfig = {
            id,
            no,
            memo,
            c_no,
            c_gall_id: id,
            c_gall_no: no,
            _GALLTYPE_: type,
            name: this.username,
            password: this.password,
            service_code: neverKey
        }

        if (this.captcha) {
            const { data } = await this.requestCaptchaSession(id, type, 'comment', ci_t, cookie);

            const res = await this.requestOcr(data);

            requestConfig.code = res.ocrs[0].text.toLowerCase();
        }

        const res = await this.axios({
            method: 'POST',
            url: COMMENT_POST_URL,
            data: requestConfig,
            headers: { ...this.generateDefaultHeaders(viewUrl + `&no=${no}`), cookie }
        });

        return res.data;
    }

    async removeComment(id, no, re_no) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const res = await this.axios({
            method: 'POST',
            url: COMMENT_DELETE_URL,
            data: {
                id,
                no,
                re_no,
                mode: 'del',
                _GALLTYPE_: type,
                re_password: this.password
            },
            headers: this.generateDefaultHeaders(viewUrl + `&no=${no}`)
        });

        return res.data;
    }

    async requestCommentList(id, no, page = 1) {
        const { type, viewUrl } = await this.checkVaildGall(id);

        const { e_s_n_o } = await this.parseView(viewUrl + `&no=${no}`);

        const res = await this.axios({
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

        const res = await this.axios({
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
                _GALLTYPE_: type
            },
            headers: this.generateDefaultHeaders(viewUrl + `&no=${no}`)
        });

        return res.data;
    }

    async requestDcconInfo(package_idx) {
        const res = await this.axios({
            method: 'POST',
            url: DCCON_INFO_URL,
            data: {
                package_idx
            },
            headers: this.generateDefaultHeaders()
        });

        return res.data;
    }

    async requestDcconList(page = 0) {
        const res = await this.axios({
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

        const { ci_t, cookie, cur_t, longKey } = await this.parseView(viewUrl + `&no=${no}`, isUp);

        const requestConfig = {
            id,
            no,
            ci_t,
            v_cur_t: cur_t,
            _GALLTYPE_: type,
            [longKey.name]: longKey.value,
            mode: isUp ? 'U' : 'D',
            link_id: id
        }

        if (this.captcha) {
            const { data } = await this.requestCaptchaSession(id, type, 'recommend', ci_t, cookie);

            const res = await this.requestOcr(data);

            requestConfig.code_recommend = res.ocrs[0].text.toLowerCase();
        }

        const res = await this.axios({
            method: 'POST',
            url: VOTE_URL,
            data: requestConfig,
            headers: { ...this.generateDefaultHeaders(viewUrl + `&no=${no}`), cookie }
        });

        return res.data;
    }

    async requestGuestbookWrite(userid, memo, isSecret = false) {
        await this.checkVaildUser(userid);

        const url = this.getGallogApi(userid, 'write');

        const res = await this.axios({
            method: 'POST',
            url,
            data: {
                memo,
                is_secret: isSecret ? 1 : 0,
                name: this.username,
                password: this.password
            },
            headers: this.generateDefaultHeaders(url.split('/ajax')[0])
        });

        return res.data;
    }

    async removeGuestbookWrite(userid, headnum) {
        await this.checkVaildUser(userid);

        const url = this.getGallogApi(userid, 'delete');

        const res = await this.axios({
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

        const res = await this.axios({
            method: 'POST',
            url: UPLOAD_IMAGE_URL + id,
            data: formData.getBuffer(),
            headers: formData.getHeaders()
        });

        return res.data;
    }

    async requestUploadVideo(id, path) {
        const { type } = await this.checkVaildGall(id);

        if (type === GALL_TYPE.MINI) id = 'mi$' + id;

        const formData = new FormData();

        formData.append('id', id);
        formData.append('avatar', typeof path === 'object' ? path : fs.readFileSync(path), {
            filename: this.generateRandomString() + '.mp4'
        });

        const res = await this.axios({
            method: 'POST',
            url: UPLOAD_VIDEO_URL,
            data: formData.getBuffer(),
            headers: formData.getHeaders()
        });

        return res.data;
    }

    async requestRegistVideo(id, thum_url, comment, canDownload = true, file_no) {
        const { type } = await this.checkVaildGall(id);

        const res = await this.axios({
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

        const res = await this.axios({
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

        const res = await this.axios({
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

    async requestCaptchaSession(id, type, captcha_type, ci_t, cookie) {
        await this.axios({
            method: 'POST',
            url: CAPTCHA_SESSION_URL,
            data: {
                ci_t,
                gall_id: id,
                kcaptcha_type: captcha_type,
                _GALLTYPE_: type
            },
            headers: { ...this.generateDefaultHeaders(), cookie }
        });

        const res = await this.axios({
            method: 'GET',
            url: CAPTCHA_URL + `${id}&kcaptcha_type=${captcha_type}&time=${(new Date).getTime()}&_GALLTYPE_=${type}`,
            headers: { ...this.generateDefaultHeaders(), cookie },
            responseType: 'arraybuffer'
        });

        return res;
    }

    async requestOcr(path) {
        const { hmac, ts } = kx();

        const formData = new FormData();

        formData.append('langDetect', 'true');
        formData.append('image', typeof path === 'object' ? path : fs.readFileSync(path), {
            filename: 'image',
        });

        const res = await this.axios({
            method: 'POST',
            url: PAPAGO_OCR_URL,
            params: {
                msgpad: ts,
                md: hmac
            },
            data: formData.getBuffer(),
            headers: formData.getHeaders(),
        });

        return res.data;
    }

    static async requestRankingMajor() {
        const res = await this.axios({
            method: 'GET',
            url: RANK_MAJOR_URL
        });

        return this.escapeJson(res.data);
    }

    static async requestRankingMinor() {
        const res = await this.axios({
            method: 'GET',
            url: RANK_MINOR_URL
        });

        return this.escapeJson(res.data);
    }

    static async requestRankingMini() {
        const res = await this.axios({
            method: 'GET',
            url: RANK_MINI_URL
        });

        return this.escapeJson(res.data);
    }

    async checkVaildGall(id) {
        try {
            const res = await this.axios.get(LIST_MAJOR_URL + id);

            if (res.data.includes('mgallery/')) {
                return { type: GALL_TYPE.MINOR, writeUrl: WRITE_MINOR_URL + id, deleteUrl: DELETE_MINOR_URL + id, viewUrl: VIEW_MINOR_URL + id, listUrl: LIST_MINOR_URL + id };
            } else {
                return { type: GALL_TYPE.MAJOR, writeUrl: WRITE_MAJOR_URL + id, deleteUrl: DELETE_MAJOR_URL + id, viewUrl: VIEW_MAJOR_URL + id, listUrl: LIST_MAJOR_URL + id };
            }
        } catch {
            try {
                await this.axios.get(LIST_MINI_URL + id);
                return { type: GALL_TYPE.MINI, writeUrl: WRITE_MINI_URL + id, deleteUrl: DELETE_MINI_URL + id, viewUrl: VIEW_MINI_URL + id, listUrl: LIST_MINI_URL + id };
            } catch {
                throw new Error(`갤러리를 찾을 수 없습니다. ${id}`);
            }
        }
    }

    async checkVaildUser(userid) {
        try {
            const res = await this.axios.get(GALLOG_BASE_URL + userid);
            return /<strong class="nick_name">(.*?)<\/strong>/.exec(res.data)[1];
        } catch {
            throw new Error(`유저를 찾을 수 없습니다 ${userid}`);
        }
    }

    async parseWrite(url) {
        const headtextList = [];
        const res = await this.axios.get(url);
        const $ = cheerio.load(res.data);
        const cookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');

        return {
            cookie,
            ci_t: cookie.split('ci_c=')[1].split(';')[0],
            blockKey: $('#block_key').attr('value'),
            rKey: $('#r_key').attr('value'),
            serviceCode: $('input[name="service_code"]').attr('value'),
            secretKey: res.data.match(KEY_PATTERN)[1]
        };
    }

    async parseList(url) {
        const res = await this.axios.get(url);
        const $ = cheerio.load(res.data);
        const cookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');

        return {
            cookie,
            ci_t: cookie.split('ci_c=')[1].split(';')[0],
            e_s_n_o: $('input[name="e_s_n_o"]').attr('value')
        };
    }

    async parseView(url, up = true) {
        const res = await this.axios.get(url);
        const $ = cheerio.load(res.data);
        const params = new URL(url).searchParams;
        const cookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ') + `; ${params.get('id')}${params.get('no')}_${up ? 'Firstcheck' : 'Firstcheck_down'}=Y`;

        return {
            cookie,
            ci_t: cookie.split('ci_c=')[1].split(';')[0],
            e_s_n_o: $('input[name="e_s_n_o"]').attr('value'),
            cur_t: $('#cur_t').attr('value'),
            serviceCode: $('input[name="service_code"]').attr('value'),
            secretKey: res.data.match(KEY_PATTERN)[1],
            longKey: {
                name: $('#_view_form_').contents().eq(49).attr('name'),
                value: $('#_view_form_').contents().eq(49).attr('value')
            }
        };
    }

    async parseDelete(url) {
        const res = await this.axios.get(url);
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
            secretKey: res.data.match(KEY_PATTERN)[1]
        };
    }

    escapeJson(data) {
        return JSON.parse(data.replace(/[()]/g, ''));
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

module.exports = { DcinsideApi }
