export interface MediaOptions {
  image: string | Buffer;
  video: {
    path: string;
    comment: string | number;
    canDownload: boolean;
  };
}

export type type = 'write' | 'delete' | 'check';

export class DcinsideApi {
  constructor(username: string, password: string | number);

  public requestArticle(
    id: string | number,
    subject: string,
    memo: string,
    options?: Readonly<MediaOptions>
  );

  public requestArticleEdit(
    id: string | number,
    no: number,
    subject: string,
    memo: string
  );

  public requestArticleInfo(id: string | number, no: number);

  public requestArticleFiles(id: string | number, no: number);

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

  public checkVaildGall(id: string | number);

  public checkVaildUser(userid: string | number);

  public parseWrite(url: string);

  public parseView(url: string, up: boolean);

  public parseDelete(url: string);

  public getGallogApi(userid: string | number, type: type);

  public generateRandomString();

  public generateDefaultHeaders(url: string);
}
