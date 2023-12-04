import { ISchema } from "@pjblog/atom-schema";
import { Fragment, PropsWithChildren, PropsWithoutRef, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { SchemaView } from ".";
import { Button, Row as ZRow, Col as ZCol, Space, Typography } from "antd";
import { PlusOutlined } from '@ant-design/icons';

export function ArraySchemaView<T>(props: PropsWithoutRef<{
  value?: T[],
  schema: ISchema,
  onChange: (v: T[]) => void,
  renderRow?: (props: PropsWithChildren) => ReactNode,
  renderCol?: (props: PropsWithChildren<{ name: string, schema: ISchema, value: any }>) => ReactNode,
}>) {
  const id = useMemo(() => Date.now(), []);
  const defaultValue = useMemo(() => {
    const value: T[] = props.value === undefined ? props.schema?.default : props.value;
    return (value || []).map((item, index) => {
      return {
        id: id + index,
        value: item,
      }
    })
  }, [props.value, id, props.schema]);
  const [value, setValue] = useState(defaultValue);
  const Row = props.renderRow || Fragment;
  const Col = props.renderCol || Fragment;

  const addOne = useCallback(() => {
    const _value = [...value];
    _value.push({
      id: id + _value.length,
      value: props.schema.default,
    });
    setValue(_value);
  }, [value, props.schema.default]);

  const onchange = useCallback((index: number, val: T) => {
    const { id } = value[index];
    const left = value.slice(0, index);
    const right = value.slice(index + 1);
    setValue([...left, { id, value: val }, ...right]);
  }, [value]);

  const onDelete = useCallback((index: number) => {
    const _value = [...value];
    _value.splice(index, 1);
    setValue(_value);
  }, [value])

  useEffect(() => props.onChange(value.map(v => v.value)), [value]);

  return <Row>
    <Col name={null} value={value} schema={props.schema.items}>
      <ZRow gutter={[0, 12]}>
        {
          value.map((val, index) => {
            return <ZCol span={24} key={val.id}>
              <Space>
                <Typography.Text type="secondary">{index + 1}</Typography.Text>
                <SchemaView
                  value={val.value}
                  schema={props.schema.items}
                  onChange={e => onchange(index, e)}
                  renderRow={props.renderRow}
                  renderCol={props.renderCol}
                />
                <Button danger onClick={() => onDelete(index)}>删除</Button>
              </Space>
            </ZCol>
          })
        }
        <ZCol span={24}>
          <Button icon={<PlusOutlined />} onClick={addOne} type="dashed">添加</Button>
        </ZCol>
      </ZRow>
    </Col>
  </Row>
}