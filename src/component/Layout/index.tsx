import Api from '../../service';
import styles from './index.module.less';
import classnames from 'classnames';
import PasswordPage from '../../controller/password/index.c';
import ProfilePage from '../../controller/profile/index.c';
import PostArticlePage from '../../controller/media/post/article/index.c';
import { PropsWithChildren, PropsWithoutRef, useCallback, useMemo } from "react";
import { Flex } from "../Flex";
import { Affix, Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import { MiddlewareProps } from '@pjblog/control';
import { useApplication, useMessage } from '../../main';
import { BlogDesktopThemeSmall } from '../Theme/Small';
import { useProfile } from '../../middleware/login';
import { AppstoreAddOutlined, UserOutlined, UnlockOutlined, InfoCircleOutlined, LogoutOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';

type Menu = {
  id: string,
  label: string,
  url: string,
  match: (pathname: string) => boolean
}

const urls = {
  home: '/',
  configs: '/configs',
  category: '/category',
  user: '/user',
  media: '/media',
  theme: '/theme',
  plugin: '/plugin'
}

const createMenu = (id: keyof typeof urls, name: string) => {
  return {
    id,
    label: name,
    url: urls[id],
    match: (pathname: string) => urls[id] === '/'
      ? pathname === '/'
      : pathname.startsWith(urls[id]),
  }
}

const menus: Menu[] = [
  createMenu('home', '首页'),
  createMenu('configs', '设置'),
  createMenu('category', '分类'),
  createMenu('user', '用户'),
  createMenu('media', '媒体'),
  createMenu('theme', '主题'),
  createMenu('plugin', '插件'),
]

export function Layout(props: PropsWithChildren<MiddlewareProps>) {
  return <>
    <Affix offsetTop={0}>
      <header className={styles.header}>
        <Flex block align="between" valign="middle" className={styles.container}>
          <Flex gap={24} valign="middle">
            <Space size={12}>
              <img width={32} height={32} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
              <Flex direction="vertical" valign="middle" className={styles.logo}>
                <Typography.Text className={styles.slogen}>PJBlog <span>Geek</span></Typography.Text>
                <BlogDesktopThemeSmall>
                  <Typography.Text type="secondary" className={styles.slogenextra}>Desktop Manager</Typography.Text>
                </BlogDesktopThemeSmall>
              </Flex>
            </Space>
            <ul>
              {menus.map(menu => <Link key={menu.id} state={menu} pathname={props.pathname || '/'} />)}
            </ul>
          </Flex>
          <Space size={12}>
            <AddMedia />
            <User />
          </Space>
        </Flex >
      </header >
    </Affix>
    <main>
      <div className={styles.container}>
        <div className={styles.main}>{props.children}</div>
      </div>
    </main>
  </>
}

function Link(props: PropsWithoutRef<{
  state: Menu,
  pathname: string,
}>) {
  const app = useApplication();
  const matched = useMemo(() => props.state.match(props.pathname), [props.state.match, props.pathname]);
  const onclick = useCallback(() => app.redirect(props.state.url), [props.state.url, app]);
  return <li>
    {
      matched
        ? <Typography.Text className={classnames(styles.link, styles.text)}>{props.state.label}</Typography.Text>
        : <Typography.Link type="secondary" onClick={onclick} className={styles.link}>{props.state.label}</Typography.Link>
    }
  </li>
}



function User() {
  const app = useApplication();
  const { data } = useProfile();
  const items = useMemo<MenuProps['items']>(() => ([
    {
      key: 'password',
      label: <Typography.Link onClick={() => app.redirect(PasswordPage.path().toString())}>修改密码</Typography.Link>,
      icon: <UnlockOutlined />
    },
    {
      key: 'profile',
      label: <Typography.Link onClick={() => app.redirect(ProfilePage.path().toString())}>修改个人信息</Typography.Link>,
      icon: <InfoCircleOutlined />
    },
    {
      key: 'logout',
      label: <Logout />,
      icon: <LogoutOutlined />
    },
  ]), [app]);
  return <Flex gap={8} valign="middle" style={{ cursor: 'pointer' }}>
    <Dropdown menu={{ items }} placement="bottomRight">
      <Avatar src={data.avatar} shape="square" size={34} icon={<UserOutlined />} />
    </Dropdown>
  </Flex>
}

function Logout() {
  const msg = useMessage();
  const app = useApplication();
  const { refresh } = useProfile();
  const { loading, runAsync } = useRequest(() => Api.User.logout(), {
    manual: true,
  })
  const submit = useCallback(() => {
    runAsync()
      .then(refresh)
      .then(() => msg.success('退出登录成功'))
      .catch(e => msg.error(e.message))
  }, [runAsync, app, msg])
  return <Typography.Link disabled={loading} onClick={submit}>退出登录</Typography.Link>
}

function AddMedia() {
  const app = useApplication();
  const items = useMemo<MenuProps['items']>(() => ([
    {
      key: 'article',
      label: <Typography.Link onClick={() => app.redirect(PostArticlePage.path().toString())}>新建文章</Typography.Link>,
      icon: <FileMarkdownOutlined />
    },
  ]), [app]);
  return <Dropdown menu={{ items }} placement="bottomRight">
    <Button icon={<AppstoreAddOutlined />} />
  </Dropdown>
}