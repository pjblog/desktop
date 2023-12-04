import Api from '../../service';
import styles from './index.module.less';
import dayjs from 'dayjs';
import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { useApplication, useMessage } from "../../main";
import { Loading } from '../../component/Loading';
import { Avatar, Col, Input, Pagination, Row, Select, Space, Switch, Typography } from 'antd';
import { PropsWithoutRef, useCallback, useMemo, useState } from 'react';
import { IUser } from '../../service/user.type';
import { Flex } from '../../component/Flex';
import { BlogDesktopThemeSmall } from '../../component/Theme/Small';
import { UserOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { AdminMiddlewaare } from '../../middleware/admin';

const Page = defineController<never, 'page' | 'q' | 'a' | 'f'>(LoginMiddleware, AdminMiddlewaare, Layout, (props) => {
  const app = useApplication();
  const current = useMemo(() => Number(props.query.page || '1'), [props.query.page]);
  const keyword = useMemo(() => props.query.q, [props.query.q]);
  const admin = useMemo(() => Number(props.query.a || '0'), [props.query.a]);
  const forbiden = useMemo(() => Number(props.query.f || '0'), [props.query.f]);
  const { loading, data, page, size, total, error } = app.useQuery(() => Api.User.getList(current, keyword, admin, forbiden), {
    defaultValue: [],
    refreshDeps: [current, keyword, admin, forbiden],
  })
  return <Loading loading={loading} error={error}>
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Text>条件筛选：</Typography.Text>
          <Flex block gap={24}>
            <Space direction="vertical">
              <BlogDesktopThemeSmall>
                <Typography.Text type="secondary">是否管理员</Typography.Text>
              </BlogDesktopThemeSmall>
              <Select loading={loading} options={[
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]} value={admin} onChange={e => {
                app.redirect(Page.path().query({
                  page: '1',
                  q: keyword,
                  a: e + '',
                  f: forbiden + ''
                }).toString());
              }} />
            </Space>
            <Space direction="vertical">
              <BlogDesktopThemeSmall>
                <Typography.Text type="secondary">禁止登录</Typography.Text>
              </BlogDesktopThemeSmall>
              <Select loading={loading} options={[
                { label: '禁止', value: 1 },
                { label: '允许', value: 0 }
              ]} value={forbiden} onChange={e => {
                app.redirect(Page.path().query({
                  page: '1',
                  q: keyword,
                  a: admin + '',
                  f: e + ''
                }).toString());
              }} />
            </Space>
            <Space direction="vertical">
              <BlogDesktopThemeSmall>
                <Typography.Text type="secondary">关键字</Typography.Text>
              </BlogDesktopThemeSmall>
              <Input.Search
                loading={loading}
                enterButton="搜索"
                defaultValue={keyword}
                placeholder="搜索关键字"
                onChange={e => {
                  if (!e.target.value) {
                    app.redirect(Page.path().query({
                      page: '1',
                      q: '',
                      a: admin + '',
                      f: forbiden + ''
                    }).toString());
                  }
                }}
                onSearch={e => {
                  app.redirect(Page.path().query({
                    page: '1',
                    q: e,
                    a: admin + '',
                    f: forbiden + ''
                  }).toString());
                }}
              />
            </Space>
          </Flex>
        </Space>
      </Col>
      {
        data.map(user => {
          return <Col span={24} key={user.id} className={styles.user}>
            <User {...user} />
          </Col>
        })
      }
      <Col span={24}>
        <Flex align="center" valign="middle" block>
          <Pagination current={page} pageSize={size} total={total} onChange={p => {
            app.redirect(Page.path().query({
              page: p + '',
              q: keyword,
              a: admin + '',
              f: forbiden + ''
            }).toString());
          }} />
        </Flex>
      </Col>
    </Row>
  </Loading>
})

function User(props: PropsWithoutRef<IUser>) {
  return <Flex block gap={24} align="between" valign="middle">
    <Flex valign="middle" gap={8} scroll="hide">
      <Avatar src={props.avatar} shape="square" size={40} icon={<UserOutlined />} />
      <Space size={0} direction="vertical">
        <Typography.Text>{props.nickname}</Typography.Text>
        <BlogDesktopThemeSmall>
          <Typography.Text type="secondary">@{props.account}</Typography.Text>
        </BlogDesktopThemeSmall>
      </Space>
    </Flex>
    <Flex valign="middle" align="right" gap={48}>
      {!!props.website && <Flex direction="vertical" valign="middle" align="center">
        <BlogDesktopThemeSmall>
          <Typography.Text type="secondary">个人网站</Typography.Text>
          <Typography.Link ellipsis target="_blank" href={props.website}>{props.website}</Typography.Link>
        </BlogDesktopThemeSmall>
      </Flex>}
      {!!props.email && <Flex direction="vertical" valign="middle" align="center">
        <BlogDesktopThemeSmall>
          <Typography.Text type="secondary">邮箱</Typography.Text>
          <Typography.Text ellipsis type="secondary" copyable={{ text: props.email }}>{props.email}</Typography.Text>
        </BlogDesktopThemeSmall>
      </Flex>}
      <Flex direction="vertical" valign="middle" align="center">
        <BlogDesktopThemeSmall>
          <Typography.Text type="secondary">注册时间</Typography.Text>
          <Typography.Text type="success">{dayjs(props.gmt_create).format('YYYY-MM-DD HH:mm')}</Typography.Text>
        </BlogDesktopThemeSmall>
      </Flex>
      <Flex direction="vertical" valign="middle" align="center">
        <BlogDesktopThemeSmall>
          <Typography.Text type="secondary">最后登录于</Typography.Text>
          <Typography.Text type="warning">{dayjs(props.gmt_modified).format('YYYY-MM-DD HH:mm')}</Typography.Text>
        </BlogDesktopThemeSmall>
      </Flex>
      <Space size={12}>
        <Flex direction="vertical" align="center" valign="middle" gap={[0, 4]}>
          <BlogDesktopThemeSmall>
            <Typography.Text type="secondary">权限</Typography.Text>
          </BlogDesktopThemeSmall>
          <Admin {...props} />
        </Flex>
        <Flex direction="vertical" align="center" valign="middle" gap={[0, 4]}>
          <BlogDesktopThemeSmall>
            <Typography.Text type="secondary">状态</Typography.Text>
          </BlogDesktopThemeSmall>
          <Forbiden {...props} />
        </Flex>
      </Space>
    </Flex>
  </Flex>
}

function Admin(props: PropsWithoutRef<IUser>) {
  const msg = useMessage();
  const [value, setValue] = useState(props.admin);
  const { loading, runAsync } = useRequest(Api.User.admin.bind(Api.User) as typeof Api.User.admin, {
    manual: true,
  })
  const submit = useCallback((value: boolean) => {
    setValue(value);
    runAsync(props.account, value)
      .then(() => msg.success('修改成功'))
      .catch(e => {
        setValue(!value);
        return msg.error(e.message);
      })
  }, [runAsync, props.account, setValue])
  return <Switch
    checked={value}
    checkedChildren="管理"
    unCheckedChildren="成员"
    disabled={loading}
    onChange={submit}
  />
}

function Forbiden(props: PropsWithoutRef<IUser>) {
  const msg = useMessage();
  const [value, setValue] = useState(props.forbiden);
  const { loading, runAsync } = useRequest(Api.User.forbiden.bind(Api.User) as typeof Api.User.forbiden, {
    manual: true,
  })
  const submit = useCallback((value: boolean) => {
    setValue(value);
    runAsync(props.account, value)
      .then(() => msg.success('修改成功'))
      .catch(e => {
        setValue(!value);
        return msg.error(e.message);
      })
  }, [runAsync, props.account, setValue])
  return <Switch
    checked={value}
    checkedChildren="禁止"
    unCheckedChildren="允许"
    disabled={loading}
    onChange={submit}
  />
}

export default Page;