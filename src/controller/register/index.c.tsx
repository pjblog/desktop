import styles from './index.module.less';
import Api from '../../service';
import Login from '../login.c';
import { defineController } from "@pjblog/control";
import { Button, Col, Input, Row, Typography } from 'antd';
import { useApplication, useMessage } from '../../main';
import { FormEvent, useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import { Flex } from "../../component/Flex";
import { BlogDesktopThemeSmall } from "../../component/Theme/Small";
import { Password } from '../../component/Password';

export default defineController<never, 'redirect_url'>(props => {
  const app = useApplication();
  const msg = useMessage();
  const [account, setAccount] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [conPassword, setConPassword] = useState<string>(null);
  const { loading, runAsync } = useRequest(
    Api.User.Register.bind(Api.User) as typeof Api.User.Register,
    { manual: true }
  )
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return msg.warning('请输入账号');
    if (!password) return msg.warning('请输入密码');
    if (!Password.validate(password)) return msg.warning('密码不符合规则，请完善密码');
    if (conPassword !== password) return msg.warning('两次输入的密码不一致');
    runAsync(account, password)
      .then(() => msg.success('注册成功'))
      .then(() => {
        if (props.query.redirect_url) {
          window.location.href = props.query.redirect_url;
        } else {
          app.reload();
        }
      })
      .catch(e => msg.error(e.message));
  }, [account, password, conPassword]);

  return <form className={styles.fullscreen} onSubmit={onSubmit}>
    <Flex full block align="center" valign="middle">
      <Row gutter={[0, 28]} className={styles.box}>
        <Col span={24}>
          <Flex direction="vertical" align="center">
            <Typography.Title level={3}>博客注册</Typography.Title>
            <Typography.Paragraph type="secondary">PJBlog Geek Desktop Manager</Typography.Paragraph>
          </Flex>
        </Col>
        <Col span={24}>
          <Input placeholder="账号" size="large" autoFocus value={account} onChange={e => setAccount(e.target.value)} />
        </Col>
        <Col span={24}>
          <Password placeholder="密码" size="large" value={password} onChange={e => setPassword(e)} />
        </Col>
        <Col span={24}>
          <Input.Password placeholder="确认密码" size="large" value={conPassword} onChange={e => setConPassword(e.target.value)} />
        </Col>
        <Col span={24}>
          <Button htmlType="submit" type="primary" block size="large" loading={loading}>登录</Button>
        </Col>
        <Col span={24}>
          <Flex block align="center">
            <BlogDesktopThemeSmall>
              <Typography.Paragraph type="secondary">
                已有账号？
                <Typography.Link onClick={() => app.redirect(Login.path().query({
                  redirect_url: props.query.redirect_url,
                }).toString())}>去登录</Typography.Link>
              </Typography.Paragraph>
            </BlogDesktopThemeSmall>
          </Flex>
        </Col>
      </Row>
    </Flex>
  </form>
})