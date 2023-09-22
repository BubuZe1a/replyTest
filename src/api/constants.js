const BASE_URL = 'https://gall.dcinside.com';
const MOBILE_BASE_URL = 'https://m.dcinside.com';
const SEARCH_BASE_URL = 'https://search.dcinside.com';
const UPLOAD_BASE_URL = 'https://upimg.dcinside.com';
const M4UP_BASE_URL = 'https://m4up1.dcinside.com';
const GALLOG_BASE_URL = 'https://gallog.dcinside.com/';
const IMG2_BASE_URL = 'https://img2.dcinside.com/';
const JSON_BASE_URL = 'https://json2.dcinside.com';
const DCCON_BASE_URL = 'https://dccon.dcinside.com';
const PAPAGO_OCR_URL = 'https://apis.naver.com/papago/papago_app/ocr/detect';

module.exports = {
    BASE_URL,
    UPLOAD_BASE_URL,
    M4UP_BASE_URL,
    SEARCH_BASE_URL,
    GALLOG_BASE_URL,
    MOBILE_BASE_URL,
    DCCON_BASE_URL,
    IMG2_BASE_URL,
    JSON_BASE_URL,
    PAPAGO_OCR_URL,
    INFO_MAJOR_URL: `${MOBILE_BASE_URL}/major/gallinfo`,
    INFO_MINOR_URL: `${MOBILE_BASE_URL}/minor/gallinfo`,
    _GALL_URL: `${BASE_URL}/ajax/gallery_top_ajax/relation`,
    AUTO_SEARCH_URL: `${SEARCH_BASE_URL}/autocomplete`,
    VOTE_POLL_URL: `${BASE_URL}/ajax/poll_ajax/update_vote`,
    REGIST_POLL_URL: `${BASE_URL}/ajax/poll_ajax/regist_poll`,
    END_POLL_URL: `${BASE_URL}/ajax/poll_ajax/end_password_submit`,
    LIST_POST_URL: `${MOBILE_BASE_URL}/ajax/response-list`,
    RANK_MAJOR_URL: `${JSON_BASE_URL}/json1/ranking_gallery.php`,
    RANK_MINOR_URL: `${JSON_BASE_URL}/json1/mgallmain/mgallery_ranking.php`,
    RANK_MINI_URL: `${JSON_BASE_URL}/json1/migallmain/migallery_ranking.php`,
    HOT_RANK_MAJOR_URL: `${JSON_BASE_URL}/json0/gallmain/gallery_hot_day.php`,
    HOT_RANK_MINOR_URL: `${JSON_BASE_URL}/json0/mgallmain/mgallery_hot.php`,
    HOT_RANK_MINI_URL: `${JSON_BASE_URL}/json0/mgallmain/migallery_hot.php`,
    DCCON_INFO_URL: `${DCCON_BASE_URL}/index/package_detail`,
    CAPTCHA_SESSION_URL: `${BASE_URL}/kcaptcha/session`,
    CAPTCHA_URL: `${BASE_URL}/kcaptcha/image/?gall_id=`,
    GET_VIEW_URL: `${BASE_URL}/board/view/get`,
    GET_VIEW_FILE_URL: `${BASE_URL}/board/files/get_attach_file/`,
    WRITE_MAJOR_URL: `${BASE_URL}/board/write/?id=`,
    WRITE_MINOR_URL: `${BASE_URL}/mgallery/board/write/?id=`,
    WRITE_MINI_URL: `${BASE_URL}/mini/board/write/?id=`,
    VIEW_MAJOR_URL: `${BASE_URL}/board/view/?id=`,
    VIEW_MINOR_URL: `${BASE_URL}/mgallery/board/view/?id=`,
    VIEW_MINI_URL: `${BASE_URL}/mini/board/view/?id=`,
    LIST_MAJOR_URL: `${BASE_URL}/board/lists/?id=`,
    LIST_MINOR_URL: `${BASE_URL}/mgallery/board/lists?id=`,
    LIST_MINI_URL: `${BASE_URL}/mini/board/lists?id=`,
    DELETE_MAJOR_URL: `${BASE_URL}/board/delete/?id=`,
    DELETE_MINOR_URL: `${BASE_URL}/mgallery/board/delete/?id=`,
    DELETE_MINI_URL: `${BASE_URL}/mini/board/delete/?id=`,
    BLOCK_KEY_URL: `${BASE_URL}/block/block/`,
    REGIST_VIDEO_URL: `${BASE_URL}/ajax/movie_ajax/regist_movie`,
    UPLOAD_IMAGE_URL: `${UPLOAD_BASE_URL}/upimg_file.php?id=`,
    UPLOAD_VIDEO_URL: `${M4UP_BASE_URL}/movie_upload_v1.php`,
    COMMENT_POST_URL: `${BASE_URL}/board/forms/comment_submit`,
    COMMENT_DELETE_URL: `${BASE_URL}/board/comment/comment_delete_submit`,
    COMMENT_LIST_URL: `${BASE_URL}/board/comment/`,
    DCCON_SEARCH_URL: `${BASE_URL}/dccon/search`,
    DCCON_POST_URL: `${BASE_URL}/dccon/insert_icon`,
    DCCON_LIST_URL: `${BASE_URL}/dccon/lists`,
    PORN_REPORT_URL: `${BASE_URL}/singo/singo_porno`,
    POST_URL: `${BASE_URL}/board/forms/article_submit`,
    EDIT_POST_KEY_URL: `${BASE_URL}/board/forms/modify_password_submit`,
    POST_DELETE_URL: `${BASE_URL}/board/forms/delete_password_submit`,
    EDIT_POST_URL: `${BASE_URL}/board/forms/modify_submit`,
    VOTE_URL: `${BASE_URL}/board/recommend/vote`,
    BEST_VOTE_URL: `${BASE_URL}/api/realtime_best_api/user_best`,
    HIT_VOTE_URL: `${BASE_URL}/api/userhit/add`
}