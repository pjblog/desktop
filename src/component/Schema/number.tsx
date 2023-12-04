import { ISchema } from "@pjblog/atom-schema";
import { Select, InputNumber } from "antd";
import { PropsWithRef, useEffect, useState } from "react";
import { useOptions } from "./utils";

export function NumberSchemaView(props: PropsWithRef<{
  schema: ISchema,
  value?: number,
  onChange: (v: number) => void,
}>) {
  const [value, setValue] = useState<number>(props.value === undefined ? props.schema.default : props.value);
  const options = useOptions<number>(props.schema);

  useEffect(() => props.onChange(value), [value]);
  // useEffect(() => {
  //   if (props.value !== undefined) {
  //     setValue(props.value)
  //   }
  // }, [props.value]);

  if (options.length) {
    return <Select
      options={options}
      value={value}
      onChange={e => setValue(e)}
      placeholder={props.schema.placeholder}
      style={props.schema.style}
    />
  }

  return <InputNumber
    min={props.schema.minimum}
    max={props.schema.maximum}
    value={value}
    onChange={e => setValue(e)}
    step={props.schema.multipleOf}
    placeholder={props.schema.placeholder}
    style={props.schema.style}
  />
}