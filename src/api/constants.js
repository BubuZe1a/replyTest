const BASE_URL = 'https://gall.dcinside.com';
const UPLOAD_BASE_URL = 'https://upimg.dcinside.com';
const M4UP_BASE_URL = 'https://m4up1.dcinside.com';
const GALLOG_BASE_URL = 'https://gallog.dcinside.com/';

module.exports = {
    BASE_URL,
    UPLOAD_BASE_URL,
    M4UP_BASE_URL,
    GALLOG_BASE_URL,
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
    DCCON_POST_URL: `${BASE_URL}/dccon/insert_icon`,
    DCCON_LIST_URL: `${BASE_URL}/dccon/lists`,
    POST_URL: `${BASE_URL}/board/forms/article_submit`,
    EDIT_POST_KEY_URL: `${BASE_URL}/board/forms/modify_password_submit`,
    POST_DELETE_URL: `${BASE_URL}/board/forms/delete_password_submit`,
    EDIT_POST_URL: `${BASE_URL}/board/forms/modify_submit`,
    VOTE_URL: `${BASE_URL}/board/recommend/vote`,
    BEST_VOTE_URL: `${BASE_URL}/api/realtime_best_api/user_best`,
    HIT_VOTE_URL: `${BASE_URL}/api/userhit/add`
}
