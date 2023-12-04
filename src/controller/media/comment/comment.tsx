import dayjs from 'dayjs';
import styles from './style.module.less';
import { parse } from 'marked';
import { PropsWithoutRef, useMemo } from "react";
import { IComment } from "../../../service/media.type";
import { Flex } from '../../../component/Flex';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { BlogDesktopThemeSmall } from '../../../component/Theme/Small';

export function Comment(props: PropsWithoutRef<IComment>) {
  const html = useMemo(() => parse(props.content), [props.content]);
  return <BlogDesktopThemeSmall>
    <Flex block className={styles.comment} gap={12}>
      <div className={styles.avatar}>
        <Avatar src={props.avatar} size={38} icon={<UserOutlined />} />
      </div>
      <Flex span={1} direction="vertical">
        <Typography.Text type="secondary">
          <Typography.Link type="success">{props.nickname}</Typography.Link> 发表于 {dayjs(props.gmtc).format('YYYY-MM-DD HH:mm:ss')}
        </Typography.Text>
        <div dangerouslySetInnerHTML={{ __html: html }} className={styles.markdown}></div>
      </Flex>

    </Flex>
  </BlogDesktopThemeSmall>
}