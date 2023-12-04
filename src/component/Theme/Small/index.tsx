import { PropsWithChildren } from "react";
import { ConfigProvider } from 'antd';

export function BlogDesktopThemeSmall(props: PropsWithChildren) {
  return <ConfigProvider
    theme={{
      token: {
        fontSize: 12,
      },
    }}
  >{props.children}</ConfigProvider>
}