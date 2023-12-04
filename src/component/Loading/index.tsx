import { PropsWithChildren } from "react";
import { Exception } from '@pjblog/exception'
import { Spin, Empty, Button } from "antd";

export function Loading(props: PropsWithChildren<{
  loading: boolean,
  error?: Exception,
  refresh?: () => unknown,
}>) {
  return <Spin spinning={props.loading}>
    {
      !!props?.error
        ? <Empty description={props.error.message}>
          {!!props.refresh && <Button type="primary" onClick={props.refresh}>重试</Button>}
        </Empty>
        : props.children
    }
  </Spin>
}