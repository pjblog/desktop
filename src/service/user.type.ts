export interface IProfile {
  account: string,
  nickname: string,
  email: string,
  avatar: string,
  admin: boolean,
  website: string,
}

export interface IUser {
  "id": number,
  "account": string,
  "nickname": string,
  "email": string,
  "avatar": string,
  "password": string,
  "salt": string,
  "forbiden": boolean,
  "admin": boolean,
  "website": string,
  "thirdpart": boolean,
  "thirdpart_node_module": string,
  "gmt_create": string | Date,
  "gmt_modified": string | Date,
}