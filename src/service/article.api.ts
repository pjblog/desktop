import { Api } from "@pjblog/control";
import { IArticlePoster } from "./media.type";

export class BlogMediaArticleApi extends Api {
  public remove(code: string) {
    return this.delete('/-/media/' + code + '/article');
  }

  public addone(data: IArticlePoster) {
    return this.put('/-/media/article', data);
  }

  public update(code: string, data: IArticlePoster) {
    return this.post('/-/media/' + code + '/article', data);
  }

  public info(code: string) {
    return this.get<Partial<IArticlePoster>>('/-/media/' + code + '/article');
  }
}