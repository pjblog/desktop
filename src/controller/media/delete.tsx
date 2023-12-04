import { Exception } from '@pjblog/exception';
import Api from '../../service';
import { MEDIA_TYPE } from "@pjblog/types";
import { PropsWithoutRef, useCallback } from "react";
import { Popconfirm, Typography } from 'antd';
import { useRequest } from 'ahooks';
import { useMessage } from '../../main';

export function MediaDelete(props: PropsWithoutRef<{
  code: string,
  type: MEDIA_TYPE,
  action: () => void
}>) {
  const msg = useMessage();
  const { loading, runAsync } = useRequest(getRequest(props.code, props.type), {
    manual: true,
  })
  const submit = useCallback(() => {
    runAsync()
      .then(props.action)
      .then(() => msg.success('删除成功'))
      .catch(e => msg.error(e.message))
  }, [runAsync, props.action])
  return <Popconfirm
    title="警告"
    description="确定删除此媒体内容？"
    onConfirm={submit}
    okText="删除"
    cancelText="取消"
    disabled={loading}
  >
    <Typography.Link type="danger" disabled={loading}>删除</Typography.Link>
  </Popconfirm>
}

function getRequest(code: string, type: MEDIA_TYPE) {
  switch (type) {
    case MEDIA_TYPE.ARTICLE:
      return () => Api.Article.remove(code);
    default: throw new Exception(534, '非法操作');
  }
}