import { ISchema } from "@pjblog/atom-schema";
import { useMemo } from "react";

export function useOptions<T>(schema: ISchema) {
  return useMemo(() => {
    if (!schema.enum) return [];
    if (!schema.enum.length) return [];
    const data: { label: string, value: T }[] = [];
    if (schema.enumLable && schema.enumLable.length === schema.enum.length) {
      data.push(...schema.enum.map((item, index) => {
        return {
          label: schema.enumLable[index],
          value: item,
        }
      }))
    } else {
      data.push(...schema.enum.map(item => {
        return {
          label: item,
          value: item,
        }
      }))
    }
    return data;
  }, [schema.enum, schema.enumLable]);
}