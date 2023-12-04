import { MEDIA_TYPE } from '@pjblog/types';
export interface IMedia {
  avatar: string,
  cate_id: number,
  cate_name: string,
  code: string,
  count: number,
  date: string | Date,
  description: string,
  id: number,
  nickname: string,
  title: string,
  type: MEDIA_TYPE,
  commentable: boolean,
}

export interface IComment {
  avatar: string,
  content: string,
  gmtc: string | Date
  gmtm: string | Date
  id: number
  nickname: string
}

export interface IArticlePoster {
  title: string,
  description: string,
  markdown: string,
  category: number,
  tags: string[],
  source: string[],
}