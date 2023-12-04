import { Api } from "@pjblog/control";
import { IComment, IMedia } from "./media.type";
import { MEDIA_TYPE } from "@pjblog/types";

export class BlogMediaApi extends Api {
  private readonly url = '/-/media';

  public getMedias(page: number = 1, keyword: string = '', category: number = 0, type: 0 | 1 | 2 | -1 = -1, tag: string = '') {
    return this.get<IMedia[]>(this.url + `?page=${page}&keyword=${keyword}&category=${category}&type=${type}&tag=${tag}`);
  }

  public setMediaCommentable(code: string, value: boolean) {
    return this.post(this.url + '/' + code + '/comment', {
      value
    })
  }

  public comments(code: string, page: number = 1) {
    return this.get<IComment[]>(this.url + '/' + code + '/comment?page=' + page)
  }

  public getType(code: string) {
    return this.get<MEDIA_TYPE>(this.url + '/' + code + '/type');
  }
}