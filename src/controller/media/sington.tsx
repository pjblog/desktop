import dayjs from 'dayjs';
import Api from '../../service';
import styles from './index.module.less';
import Page from './index.c';
import Edit from './[code]/index.c';
import { PropsWithoutRef, useCallback, useMemo, useState } from "react";
import { IMedia } from "../../service/media.type";
import { Flex } from "../../component/Flex";
import { BlogDesktopThemeSmall } from "../../component/Theme/Small";
import { Avatar, Divider, Space, Switch, Tooltip, Typography } from "antd";
import { MEDIA_TYPE } from "@pjblog/types";
import { UserOutlined, EyeOutlined } from '@ant-design/icons';
import { parse } from 'marked';
import { useRequest } from 'ahooks';
import { useApplication, useMessage } from '../../main';
import { MediaDelete } from './delete';
import { Comments } from './comment';

export function SingleTon(props: PropsWithoutRef<IMedia & {
  delone: (c: string) => void
}>) {
  const msg = useMessage();
  const app = useApplication();
  const query = app.useLocation().query;
  const [open, setOpen] = useState(true);
  const [comment, setComment] = useState(false);
  const [commentable, setCommentable] = useState(props.commentable);
  const html = useMemo(() => parse(props.description), [props.description]);
  const { loading, runAsync } = useRequest(Api.Media.setMediaCommentable.bind(Api.Media) as typeof Api.Media.setMediaCommentable, {
    manual: true,
  })
  const onCommentable = useCallback((value: boolean) => {
    runAsync(props.code, value)
      .then(() => setCommentable(value))
      .then(() => msg.success('更新成功'))
      .catch(e => msg.error(e.message));
  }, [runAsync, props.code, setCommentable])
  const onRedirectCategory = useCallback(() => {
    app.redirect(Page.path().query({
      ...query as any,
      category: props.cate_id + ''
    }).toString())
  }, [app, props.cate_id])
  const onRedirectEdit = useCallback(() => {
    app.redirect(Edit.path({
      code: props.code,
    }).toString())
  }, [app, props.code])
  return <Flex direction="vertical">
    <BlogDesktopThemeSmall>
      <Flex valign="middle">
        <MediaType value={props.type} />
        <Divider type="vertical" />
        <Typography.Text type="secondary">{dayjs(props.date).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
        <Divider type="vertical" />
        <Typography.Link type="secondary" onClick={onRedirectCategory}>{props.cate_name}</Typography.Link>
      </Flex>
    </BlogDesktopThemeSmall>
    <Typography.Text className={styles.title}>{props.title}</Typography.Text>
    <Flex valign="middle">
      <BlogDesktopThemeSmall>
        <Space size={3}>
          <Avatar src={props.avatar} shape="square" size={16} icon={<UserOutlined />} />
          <Typography.Text type="secondary">{props.nickname}</Typography.Text>
        </Space>
        <Divider type="vertical" />
        <Space>
          <EyeOutlined />
          <Typography.Text type="secondary">{props.count}</Typography.Text>
        </Space>
        <Divider type="vertical" />
        <Space>
          <Typography.Link type="secondary" onClick={() => setComment(!comment)}>评论</Typography.Link>
          <Tooltip title="是否可以评论：当全局开启部分评论模式的时候，此选项才有效果。">
            <Switch disabled={loading} size="small" checked={commentable} onChange={e => onCommentable(e)} />
          </Tooltip>
        </Space>
        <Divider type="vertical" />
        <Typography.Link type="success" onClick={onRedirectEdit}>编辑</Typography.Link>
        <Divider type="vertical" />
        <MediaDelete code={props.code} type={props.type} action={() => props.delone(props.code)} />
        <Divider type="vertical" />
        <Typography.Link onClick={() => setOpen(!open)}>{open ? '折叠' : '展开'}</Typography.Link>
      </BlogDesktopThemeSmall>
    </Flex>
    {open && <BlogDesktopThemeSmall>
      <div dangerouslySetInnerHTML={{ __html: html }} className={styles.markdown}></div>
    </BlogDesktopThemeSmall>}
    {comment && <Divider orientation="left" plain>
      <BlogDesktopThemeSmall>
        <Typography.Text type="secondary">评论列表</Typography.Text>
      </BlogDesktopThemeSmall>
    </Divider>}
    {comment && <div style={{ width: '100%' }}>
      <Comments code={props.code} />
    </div>}
  </Flex>
}

function MediaType(props: PropsWithoutRef<{ value: MEDIA_TYPE }>) {
  switch (props.value) {
    case MEDIA_TYPE.ARTICLE:
      return <Typography.Text type="secondary">文章</Typography.Text>
    case MEDIA_TYPE.PICTURE:
      return <Typography.Text type="secondary">图片</Typography.Text>
    case MEDIA_TYPE.VIDEO:
      return <Typography.Text type="secondary">视频</Typography.Text>
    default: return <Typography.Text type="secondary">未知</Typography.Text>
  }
}