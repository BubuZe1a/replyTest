import { CreateAxiosDefaults } from 'axios';

export interface ArticleOptions {
  image: string;
  video: {
    path: string;
    comment: string | number;
    canDownload: boolean;
  };
  headtext: number;
}

export interface DcinsideApiOptions {
  username: string | number;
  password: string | number;
  captcha: boolean;
  proxy: {
    protocol: string;
    host: string;
    port: number;
  };
}

export type gallogType = 'write' | 'delete' | 'check';

export type captchaType = 'write' | 'recommend' | 'comment';

export class DcinsideApi {
  constructor(options: DcinsideApiOptions);

  public setAxios(options: CreateAxiosDefaults);

  public requestArticle(
    id: string | number,
    subject: string,
    memo: string,
    options?: Readonly<ArticleOptions>
  );

  public requestArticleEdit(
    id: string | number,
    no: number,
    subject: string,
    memo: string
  );

  public requestArticleInfo(id: string | number, no: number);

  public requestArticleFiles(id: string | number, no: number);

  public requestArticleReportPorn(id: string | number, no: number);

  public removeArticle(id: string | number, no: number);

  public requestComment(
    id: string | number,
    no: number,
    memo: string | number,
    c_no: number
  );

  public removeComment(id: string | number, no: number, re_no: number);

  public requestCommentList(id: string | number, no: number, page: number);

  public requestDccon(
    id: string | number,
    no: number,
    package_idx: number,
    detail_idx: number
  );

  public requestDcconList(page: number);

  public requestVote(id: string | number, no: number, isUp: boolean);

  public requestGuestbookWrite(
    userid: string | number,
    memo: string | number,
    isSecret?: boolean
  );

  public removeGuestbookWrite(userid: string | number, headnum: number);

  public requestUploadImage(id: string | number, path: string);

  public requestUploadVideo(id: string | number, path: string);

  public requestRegistVideo(
    id: string | number,
    thum_url: string,
    comment: string | number,
    canDownload: boolean,
    file_no: number
  );

  public requestHit(id: string | number, no: number);

  public requestBest(id: string | number, no: number);

  public requestCaptchaSession(
    id: string | number,
    type: string,
    captcha_type: captchaType,
    ci_t: string,
    cookie: string
  );

  public requestOcr(path: string);

  public checkVaildGall(id: string | number);

  public checkVaildUser(userid: string | number);

  public parseWrite(url: string);

  public parseList(url: string);

  public parseView(url: string, up: boolean);

  public parseDelete(url: string);

  public getGallogApi(userid: string | number, type: gallogType);

  public generateRandomString();

  public generateDefaultHeaders(url: string);
}
