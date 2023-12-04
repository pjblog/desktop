import { ISchema } from "@pjblog/atom-schema";
import { PropsWithChildren, PropsWithoutRef, ReactNode } from "react";
import { NumberSchemaView } from "./number";
import { StringSchemaView } from "./string";
import { BoolSchemaView } from "./bool";
import { ObjectSchemaView } from "./object";
import { ArraySchemaView } from "./array";

export function SchemaView(props: PropsWithoutRef<{
  value?: any,
  schema: ISchema,
  onChange: (e: any) => void,
  renderRow?: (props: PropsWithChildren) => ReactNode,
  renderCol?: (props: PropsWithChildren<{ name: string, schema: ISchema, value: any }>) => ReactNode,
}>) {
  switch (props.schema.type) {
    case 'number':
    case 'integer':
      return <NumberSchemaView
        value={props.value}
        schema={props.schema}
        onChange={props.onChange}
      />
    case 'string':
      return <StringSchemaView
        value={props.value}
        schema={props.schema}
        onChange={props.onChange}
      />
    case 'boolean':
      return <BoolSchemaView
        value={props.value}
        schema={props.schema}
        onChange={props.onChange}
      />
    case 'object':
      return <ObjectSchemaView
        value={props.value}
        schema={props.schema}
        onChange={props.onChange}
        renderRow={props.renderRow}
        renderCol={props.renderCol}
      />
    case 'array':
      return <ArraySchemaView
        value={props.value}
        schema={props.schema}
        onChange={props.onChange}
        renderRow={props.renderRow}
        renderCol={props.renderCol}
      />
    default: return null;
  }
}