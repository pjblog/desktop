import { ISchema } from "@pjblog/atom-schema";
import { Fragment, PropsWithChildren, PropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";
import { SchemaView } from "./index";

export function ObjectSchemaView<T extends Record<string, any>>(props: PropsWithoutRef<{
  value?: T,
  schema: ISchema,
  onChange: (v: T) => void,
  renderRow?: (props: PropsWithChildren) => ReactNode,
  renderCol?: (props: PropsWithChildren<{ name: string, schema: ISchema, value: any }>) => ReactNode,
}>) {
  const keys = useMemo(() => Object.keys(props.schema.properties), [props.schema.properties]);
  const defaultValue = useMemo<T>(() => {
    const value: Record<string, any> = {};
    keys.forEach(key => value[key] = props.schema.properties[key].default);
    return value as T;
  }, [props.schema.properties, keys]);
  const [value, setValue] = useState<T>(props.value === undefined ? defaultValue : props.value);

  const Row = props.renderRow || Fragment;
  const Col = props.renderCol || Fragment;

  useEffect(() => props.onChange(value), [value]);
  // useEffect(() => {
  //   if (props.value !== undefined) {
  //     setValue(props.value)
  //   }
  // }, [props.value]);

  return <Row>
    {
      keys.map(key => {
        const val = value[key];
        const schema = props.schema.properties[key];
        return <Col key={key} name={key} schema={schema} value={val}>
          <SchemaView
            value={val}
            schema={schema}
            onChange={e => setValue({ ...value, [key]: e })}
            renderRow={props.renderRow}
            renderCol={props.renderCol}
          />
        </Col>
      })
    }
  </Row>
}
