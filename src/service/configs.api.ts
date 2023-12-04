import { Api } from "@pjblog/control";
import { IConfigsDataSource } from "./configs.type";

export class BlogConfigsApi extends Api {
  private readonly url = '/-/setting';

  public getDataSource() {
    return this.get<IConfigsDataSource>(this.url);
  }

  public setDataSource(key: string, value: any) {
    return this.post('/-/setting', {
      [key]: value,
    })
  }
}