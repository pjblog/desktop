import Api from '../../service';
import { Button, Popconfirm } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from "ahooks";
import { PropsWithoutRef, useCallback } from 'react';
import { ICategory } from '../../service/category.type';
import { useMessage } from '../../main';

export function AddCategory(props: PropsWithoutRef<{
  action: (category: ICategory) => void
}>) {
  const msg = useMessage();
  const { loading, runAsync } = useRequest(Api.Category.add.bind(Api.Category) as typeof Api.Category.add, {
    manual: true
  })
  const submit = useCallback(() => {
    const name = '新分类' + Date.now();
    runAsync(name, '')
      .then((data) => props.action(data.data))
      .then(() => msg.success('添加成功'))
      .catch(e => msg.error(e.message))
  }, [runAsync, props.action])
  return <Popconfirm
    title="警告"
    description="确定新增一个默认的分类吗？"
    onConfirm={submit}
    okText="添加"
    cancelText="取消"
    disabled={loading}
  >
    <Button type="primary" icon={<PlusOutlined />}>添加默认分类</Button>
  </Popconfirm>
}