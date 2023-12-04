import Api from '../../service';
import styles from './index.module.less';
import LoginPage from '../login.c';
import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { FormEvent, useCallback, useState } from "react";
import { Button, Col, Input, Row, Typography } from "antd";
import { Flex } from "../../component/Flex";
import { useApplication, useMessage } from '../../main';
import { useRequest } from 'ahooks';
import { Password } from '../../component/Password';
import { BlogDesktopThemeSmall } from '../../component/Theme/Small';

export default defineController<never, 'redirect_url'>(LoginMiddleware, Layout, (props) => {
  const [op, sop] = useState<string>();
  const [np, snp] = useState<string>();
  const [cp, scp] = useState<string>();
  const msg = useMessage();
  const app = useApplication();
  const { loading, runAsync } = useRequest(Api.User.password.bind(Api.User) as typeof Api.User.password, {
    manual: true,
  })
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!op) return msg.warning('请输入旧密码');
    if (!np) return msg.warning('请输入新密码');
    if (!Password.validate(np)) return msg.warning('密码不符合规则，请完善密码');
    if (np !== cp) return msg.warning('两次输入的密码不一致');
    runAsync(op, np)
      .then(() => {
        if (props.query.redirect_url) {
          window.location.href = props.query.redirect_url;
        }
      })
      .then(() => msg.success('修改成功'))
      .catch(e => msg.error(e.message))
  }, [op, np, cp, props.query.redirect_url, msg, runAsync]);
  return <Flex block align="center">
    <form className={styles.box} onSubmit={onSubmit}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>修改密码</Typography.Title>
          <BlogDesktopThemeSmall>
            <Typography.Text type="secondary">已经重置密码？<Typography.Link onClick={() => app.redirect(LoginPage.path().query({
              redirect_url: props.query.redirect_url,
            }).toString())}>去登录</Typography.Link></Typography.Text>
          </BlogDesktopThemeSmall>
        </Col>
        <Col span={24}>
          <Row gutter={[0, 12]}>
            <Col span={24}>
              <Input.Password autoFocus size="large" placeholder="旧密码" allowClear value={op} onChange={e => sop(e.target.value)} />
            </Col>
            <Col span={24}>
              <Password size="large" placeholder="新密码" value={np} onChange={e => snp(e)} />
            </Col>
            <Col span={24}>
              <Input.Password size="large" placeholder="确认密码" allowClear value={cp} onChange={e => scp(e.target.value)} />
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