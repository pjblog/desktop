import { Api } from "@pjblog/control";
import { ICategory } from "./category.type";

export class BlogCategoryApi extends Api {
  private readonly url = '/-/category';

  public getDataSource() {
    return this.get<ICategory[]>(this.url);
  }

  public add(name: string, link: string) {
    return this.put<ICategory>(this.url, { name, link });
  }

  public remove(id: number) {
    return this.delete(this.url + '/' + id);
  }

  public update(id: number, name: string, link?: string) {
    return this.post(this.url + '/' + id, {
      name, link
    })
  }

  public updateOrders(ids: number[]) {
    return this.post(this.url, ids);
  }
}