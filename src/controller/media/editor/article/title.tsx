import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithChildren } from "react";
import { Flex } from "../../../../component/Flex";
import { BlogDesktopThemeSmall } from "../../../../component/Theme/Small";
import { Typography } from "antd";
import { BaseType } from "antd/es/typography/Base";

export function Title(props: PropsWithChildren<{
  name: string,
  padding?: boolean,
  type?: BaseType
}>) {
  return <Flex block full scroll="hide" direction="vertical">
    <BlogDesktopThemeSmall>
      <Typography.Text className={styles.SurrayTitle} type={props.type}>{props.name}</Typography.Text>
    </BlogDesktopThemeSmall>
    <Flex block span={1} scroll="y" className={classnames({
      [styles.SurryPadding]: props.padding
    })}>
      {props.children}
    </Flex>
  </Flex>
}