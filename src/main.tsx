import 'antd/dist/reset.css';
import zhCN from 'antd/locale/zh_CN';
import { Application, LocationProps, Controller } from '@pjblog/control';
import { Result, App, ConfigProvider, theme, message } from 'antd';
import { PropsWithChildren, createContext, useContext } from 'react';
import { Login } from './component/Login';
import { MessageInstance } from 'antd/es/message/interface';

export const app = new Application(import.meta.env.BASE_URL);
const ApplicationContext = createContext(app);
const MessageContext = createContext<MessageInstance>(null);

const glob = import.meta.glob('./controller/**/*.c.tsx', {
  eager: true,
  import: 'default',
});

const manifest = Object.entries(glob).map(([path, fn]) => ({
  path: path.slice('./controller'.length, '.c.tsx'.length * -1).replace(/\/index$/, '') || '/',
  controller: fn as Controller,
}))

/**
 * 全局主题配置
 */
app.use('global', (props: PropsWithChildren<LocationProps>) => {
  return <ConfigProvider
    locale={zhCN}
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#1B84FF',
        borderRadius: 3,
      },
      components: {
        Card: {
          colorBgContainer: '#15171C',
          colorBorderSecondary: '#1E2027',
        },
        Message: {
          colorBgElevated: '#26272F'
        },
        Divider: {
          colorSplit: '#1E2027'
        }
      }
    }}
  >{props.children}</ConfigProvider>
})

/**
 * 全局 Application 对象透传
 * 通过`useApplication()`获取
 */
app.use('global', (props: PropsWithChildren<LocationProps>) => {
  return <ApplicationContext.Provider value={app}>
    {props.children}
  </ApplicationContext.Provider>
})

/**
 * 全局 Antd 的 APP组件包裹
 * 防止`message.success`等方法报错
 */
app.use('global', (props: PropsWithChildren<LocationProps>) => {
  const [api, holder] = message.useMessage()
  return <App>
    <MessageContext.Provider value={api}>
      {holder}
      {props.children}
    </MessageContext.Provider>
  </App>
});

/**
 * 拦截全局的请求`401`错误码
 * 转换为登录页面
 */
app.addStatusListener(401, Login);

/**
 * 页面渲染
 * 写入`404`页面
 */
app.render(document.getElementById('root'), manifest, <Result
  status="404"
  title="404"
  subTitle="Sorry, the page you visited does not exist."
/>);

export function useApplication() {
  return useContext(ApplicationContext);
}

export function useMessage() {
  return useContext(MessageContext);
}