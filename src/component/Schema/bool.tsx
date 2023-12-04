import { ISchema } from "@pjblog/atom-schema";
import { Switch } from "antd";
import { PropsWithoutRef, useEffect, useState } from "react";

export function BoolSchemaView(props: PropsWithoutRef<{
  schema: ISchema,
  value?: boolean,
  onChange: (v: boolean) => void,
}>) {
  const [value, setValue] = useState<boolean>(
    props.value === undefined
      ? props.schema.default
      : props.value
  );
  useEffect(() => props.onChange(value), [value]);
  // useEffect(() => {
  //   if (props.value !== undefined) {
  //     setValue(props.value)
  //   }
  // }, [props.value]);
  return <Switch
    checked={value}
    onChange={e => setValue(e)}
    style={props.schema.style}
    checkedChildren={props.schema.boolabel[1]}
    unCheckedChildren={props.schema.boolabel[0]}
  />
}