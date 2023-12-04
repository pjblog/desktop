import Api from '../../service';
import { PropsWithoutRef, useCallback } from 'react';
import { useRequest } from "ahooks";
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useMessage } from '../../main';

export function RemoveCategory(props: PropsWithoutRef<{
  id: number,
  action: (id: number) => void
}>) {
  const msg = useMessage();
  const { loading, runAsync } = useRequest(Api.Category.remove.bind(Api.Category) as typeof Api.Category.remove, {
    manual: true
  })

  const submit = useCallback(() => {
    runAsync(props.id)
      .then(() => props.action(props.id))
      .then(() => msg.success('删除成功'))
      .catch(e => msg.error(e.message))
  }, [props.id, runAsync, props.action])

  return <Popconfirm
    title="警告"
    description="确定删除此分类吗？"
    onConfirm={submit}
    okText="删除"
    cancelText="取消"
    disabled={loading}
  >
    <Button icon={<DeleteOutlined />} loading={loading}></Button>
  </Popconfirm>
}