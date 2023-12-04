import { ISchema } from '@pjblog/atom-schema';
export type IConfigsDataSource = Record<string, {
  value: Record<string, any>,
  schema: ISchema,
}>