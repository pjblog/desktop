import styles from './index.module.less';
import { Button, Input, Typography } from "antd";
import { PropsWithoutRef, useCallback, useMemo } from "react";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

export function Source(props: PropsWithoutRef<{
  value: string[],
  onChange: (v: string[]) => void
}>) {
  const now = useMemo(() => Date.now(), []);
  const state = useMemo(() => {
    return props.value.map((item, index) => {
      return {
        id: now + ':' + index,
        value: item,
      }
    })
  }, [props.value]);
  const onUpdate = useCallback((index: number, value: string) => {
    const _state = [...props.value];
    if (_state[index] !== undefined) {
      _state[index] = value;
    }
    props.onChange(_state);
  }, [props.value, props.onChange])
  const onAddOne = useCallback(() => {
    props.onChange([...props.value, null]);
  }, [props.value, props.onChange])
  const onDelOne = useCallback((index: number) => {
    const _state = [...props.value];
    if (_state[index] !== undefined) {
      _state.splice(index, 1);
      props.onChange(_state);
    }
  }, [props.value, props.onChange])
  return <div className={styles.sources}>
    {
      state.map((item, index) => {
        return <div key={item.id} className={styles.sourceItem}>
          <Input
            placeholder="网址"
            value={item.value}
            onChange={e => onUpdate(index, e.target.value)}
            suffix={<Typography.Link type="secondary" onClick={() => onDelOne(index)}><CloseOutlined /></Typography.Link>}
          />
        </div>
      })
    }
    <Button type="primary" onClick={onAddOne} icon={<PlusOutlined />}>新增</Button>
  </div>
}