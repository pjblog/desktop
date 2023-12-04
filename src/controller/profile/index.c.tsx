import Api from '../../service';
import styles from './index.module.less';
import { defineController } from "@pjblog/control";
import { LoginMiddleware, useProfile } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Avatar, Button, Col, Divider, Input, Row, Space, Typography } from "antd";
import { Flex } from "../../component/Flex";
import { useMessage } from '../../main';
import { useRequest } from 'ahooks';
import { UserOutlined } from '@ant-design/icons';
import { BlogDesktopThemeSmall } from '../../component/Theme/Small';

export default defineController<never, 'redirect_url'>(LoginMiddleware, Layout, (props) => {
  const { data } = useProfile()
  const [nickname, setNickname] = useState<string>(data.nickname);
  const [email, setEmail] = useState<string>(data.email);
  const [website, setWebsite] = useState<string>(data.website);
  const [avatar, setAvatar] = useState<string>(data.avatar);
  const msg = useMessage();
  const { loading, runAsync } = useRequest(Api.User.profile.bind(Api.User) as typeof Api.User.profile, {
    manual: true,
  })
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname) return msg.warning('请输入昵称');
    if (!email) return msg.warning('请输入邮箱');
    if (!avatar) return msg.warning('请输入头像');
    runAsync(nickname, email, website, avatar)
      .then(() => {
        if (props.query.redirect_url) {
          window.location.href = props.query.redirect_url;
        }
      })
      .then(() => msg.success('修改成功'))
      .catch(e => msg.error(e.message))
  }, [nickname, email, avatar, website, runAsync, props.query.redirect_url]);

  useEffect(() => {
    setNickname(data.nickname);
    setEmail(data.email);
    setWebsite(data.website);
    setAvatar(data.avatar);
  }, [data])


  return <Flex block align="center">
    <form className={styles.box} onSubmit={onSubmit}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Typography.Title level={5} style={{
            marginBottom: 16
          }}>修改个人信息</Typography.Title>

          <Flex gap={12}>
            <Avatar size={40} src={avatar} icon={<UserOutlined />} shape="square" />
            <Flex direction="vertical">
              <Typography.Text>{nickname}</Typography.Text>
              <BlogDesktopThemeSmall>
                <Space size={4}>
                  <Typography.Text type="secondary">@{data.account}</Typography.Text>
                  <Divider type="vertical" />
                  <Typography.Link href={'mailto:' + email}>{email}</Typography.Link>
                </Space>
              </BlogDesktopThemeSmall>
            </Flex>
          </Flex>
        </Col>
        <Col span={24}>
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Input value={nickname} onChange={e => setNickname(e.target.value)} size="large" placeholder="请输入昵称" />
            </Col>
            <Col span={24}>
              <Input value={email} onChange={e => setEmail(e.target.value)} size="large" placeholder="请输入邮箱" />
            </Col>
            <Col span={24}>
              <Input value={website} onChange={e => setWebsite(e.target.value)} size="large" placeholder="请输入个人网站" />
            </Col>
            <Col span={24}>
              <Input value={avatar} onChange={e => setAvatar(e.target.value)} size="large" placeholder="请输入头像地址" />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Button loading={loading} htmlType="submit" type="primary" size="large" block>修改</Button>
        </Col>
      </Row>
    </form>
  </Flex>
})