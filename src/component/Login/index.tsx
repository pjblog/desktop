import styles from './index.module.less';
import Api from '../../service';
import Register from '../../controller/register/index.c';
import { Flex } from '../Flex';
import { Button, Col, Input, Row, Typography } from 'antd';
import { useApplication, useMessage } from '../../main';
import { BlogDesktopThemeSmall } from '../Theme/Small';
import { FormEvent, useCallback, useState } from 'react';
import { useRequest } from 'ahooks';
import { Password } from '../Password';

export function Login() {
  const app = useApplication();
  const msg = useMessage();
  const { query } = app.useLocation();
  const [account, setAccount] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const { loading, runAsync } = useRequest(
    Api.User.Login.bind(Api.User) as typeof Api.User.Login,
    { manual: true }
  )
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return msg.warning('请输入账号');
    if (!password) return msg.warning('请输入密码');
    if (!Password.validate(password)) return msg.warning('密码不符合规则，请完善密码');
    runAsync(account, password)
      .then(() => {
        if (query.redirect_url) {
          window.location.href = query.redirect_url;
        } else {
          app.reload();
        }
      })
      .then(() => msg.success('登录成功'))
      .catch(e => msg.error(e.message));
  }, [account, password]);

  return <form className={styles.fullscreen} onSubmit={onSubmit}>
    <Flex full block align="center" valign="middle">
      <Row gutter={[0, 28]} className={styles.box}>
        <Col span={24}>
          <Flex direction="vertical" align="center">
            <Typography.Title level={3}>博客登录</Typography.Title>
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
          <Button htmlType="submit" type="primary" block size="large" loading={loading}>登录</Button>
        </Col>
        <Col span={24}>
          <Flex block align="center">
            <BlogDesktopThemeSmall>
              <Typography.Paragraph type="secondary">
                还没有账号？
                <Typography.Link onClick={() => app.redirect(Register.path().query({
                  redirect_url: query.redirect_url,
                }).toString())}>去注册</Typography.Link>
              </Typography.Paragraph>
            </BlogDesktopThemeSmall>
          </Flex>
        </Col>
      </Row>
    </Flex>
  </form>
}