import { Api } from '@pjblog/control';
import { IProfile, IUser } from './user.type';

export class BlogUserApi extends Api {
  private readonly url = '/-/user';
  public defaultValueWithProfile: IProfile = {
    account: null,
    nickname: null,
    email: null,
    avatar: null,
    admin: false,
    website: null,
  }


  public GetProfile() {
    return this.get<IProfile>(this.url);
  }

  public Login(account: string, password: string) {
    return this.post(this.url, {
      account, password
    })
  }

  public Register(account: string, password: string) {
    return this.put(this.url, {
      account, password
    })
  }

  public getList(page: number = 1, keyword: string = '', admin = 0, forbiden = 0) {
    return this.get<IUser[]>(this.url + '/list?page=' + page + '&keyword=' + encodeURIComponent(keyword) + '&admin=' + admin + '&forbiden=' + forbiden)
  }

  public admin(account: string, value: boolean) {
    return this.post(this.url + '/' + account + '/admin', {
      value
    })
  }

  public forbiden(account: string, value: boolean) {
    return this.post(this.url + '/' + account + '/forbiden', {
      value
    })
  }

  public logout() {
    return this.delete(this.url);
  }

  public password(op: string, np: string) {
    return this.post(this.url + '/password', {
      oldPassword: op,
      newPassword: np,
    })
  }

  public profile(nickname: string, email: string, website: string, avatar: string) {
    return this.post(this.url + '/profile', {
      nickname, email, website, avatar
    })
  }
}