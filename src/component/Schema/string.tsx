import dayjs from 'dayjs';
import { PropsWithRef, useEffect, useState } from "react";
import { ISchema } from '@pjblog/atom-schema';
import { Input, DatePicker, TimePicker, ColorPicker, Select } from "antd";
import { useOptions } from './utils';
const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm:ss';
const dateTimeFormat = dateFormat + ' ' + timeFormat;
export function StringSchemaView(props: PropsWithRef<{
  schema: ISchema,
  value?: string,
  onChange: (v: string) => void,
}>) {
  const [value, setValue] = useState<string>(props.value === undefined ? props.schema.default : props.value);
  const options = useOptions<string>(props.schema);

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

  switch (props.schema.format) {
    case 'date':
      return <DatePicker
        value={dayjs(value, dateFormat)}
        format={dateFormat}
        onChange={e => setValue(e.format(dateFormat))}
        disabled={props.schema.readOnly}
        placeholder={props.schema.placeholder}
        style={props.schema.style}
      />
    case 'date-time':
      return <DatePicker
        showTime
        value={dayjs(value, dateTimeFormat)}
        format={dateTimeFormat}
        onOk={e => setValue(e.format(dateTimeFormat))}
        disabled={props.schema.readOnly}
        placeholder={props.schema.placeholder}
        style={props.schema.style}
      />
    case 'time':
      return <TimePicker
        onOk={e => setValue(e.format(timeFormat))}
        value={dayjs(value, timeFormat)}
        disabled={props.schema.readOnly}
        placeholder={props.schema.placeholder}
        style={props.schema.style}
      />
    case 'color':
      return <ColorPicker
        size="small"
        showText
        value={value}
        onChange={e => setValue(e.toHexString())}
        disabled={props.schema.readOnly}
        style={props.schema.style}
      />
    case 'textarea':
      return <Input.TextArea
        rows={props.schema.rows || 3}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={props.schema.readOnly}
        placeholder={props.schema.placeholder}
        style={props.schema.style}
      />
    default:
      return <Input
        value={value}
        type={props.schema.format}
        onChange={e => setValue(e.target.value)}
        disabled={props.schema.readOnly}
        minLength={props.schema.minLength}
        maxLength={props.schema.maxLength}
        placeholder={props.schema.placeholder}
        style={props.schema.style}
      />
  }
}