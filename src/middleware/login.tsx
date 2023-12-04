import Api from '../service';
import { createContext, useContext } from 'react';
import { Middleware } from "@pjblog/control";
import { useApplication } from '../main';
import { Result, Spin } from 'antd';

const ProfileContext = createContext({
  data: Api.User.defaultValueWithProfile,
  refresh: () => { }
});

export function useProfile() {
  return useContext(ProfileContext);
}

export const LoginMiddleware: Middleware = props => {
  const app = useApplication();
  const { data, error, loading, refresh } = app.useQuery(() => Api.User.GetProfile(), {
    defaultValue: Api.User.defaultValueWithProfile,
  });
  return <Spin spinning={loading}>
    {
      !!error ? <Result
        status="500"
        title={error.status}
        subTitle={error.message}
      /> : <ProfileContext.Provider value={{
        data: data || Api.User.defaultValueWithProfile,
        refresh
      }}>
        {props.children}
      </ProfileContext.Provider>
    }
  </Spin>
}