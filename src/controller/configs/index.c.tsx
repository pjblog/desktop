import Api from '../../service';
import { ISchema } from '@pjblog/atom-schema';
import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { useApplication, useMessage } from "../../main";
import { Loading } from '../../component/Loading';
import { PropsWithChildren, PropsWithoutRef, useCallback, useMemo, useState } from 'react';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { SchemaView } from '../../component/Schema';
import { BlogDesktopThemeSmall } from '../../component/Theme/Small';
import { useRequest } from 'ahooks';
import { AdminMiddlewaare } from '../../middleware/admin';

interface Item {
  name: string,
  value: Record<string, any>,
  schema: ISchema,
}

export default defineController(LoginMiddleware, AdminMiddlewaare, Layout, () => {
  const app = useApplication();
  const { data, loading, error } = app.useQuery(() => Api.Configs.getDataSource(), {
    defaultValue: {}
  });
  const plugins = useMemo(() => {
    const keys = Object.keys(data);
    return keys.map(key => {
      return {
        name: key,
        value: data[key].value,
        schema: data[key].schema,
      }
    })
  }, [data]);
  return <Loading loading={loading} error={error}>
    <Row gutter={[0, 24]}>
      {
        plugins.map(plugin => {
          return <Col span={24} key={plugin.name}>
            <Configs {...plugin} />
          </Col>
        })
      }
    </Row>
  </Loading>
})

function Configs(props: PropsWithoutRef<Item>) {
  const msg = useMessage();
  const [value, setValue] = useState();
  const { loading, runAsync } = useRequest(Api.Configs.setDataSource.bind(Api.Configs) as typeof Api.Configs.setDataSource, {
    manual: true
  })
  const submit = useCallback(() => {
    runAsync(props.name, value)
      .then(() => msg.success('保存成功'))
      .catch(e => msg.error(e.message))
  }, [value])



  return <Card title={props.schema.description} size="small" extra={<Tag>{props.name}</Tag>}>
    <Space direction="vertical" size={32}>
      <SchemaView
        value={props.value}
        schema={props.schema}
        onChange={setValue}
        renderRow={RowRender}
        renderCol={ColRender}
      />
      <Button type="primary" loading={loading} onClick={submit}>保存</Button>
    </Space>
  </Card>
}

function RowRender(props: PropsWithChildren) {
  return <Row gutter={[24, 24]}>{props.children}</Row>
}

function ColRender(props: PropsWithChildren<{ schema: ISchema }>) {
  const schema = props.schema;
  return <Col span={24}>
    <Space direction="vertical">
      {!!schema.title && <Typography.Text>{schema.title}</Typography.Text>}
      {props.children}
      {!!schema.description && <BlogDesktopThemeSmall>
        <Typography.Text type="secondary">{schema.description}</Typography.Text>
      </BlogDesktopThemeSmall>}
    </Space>
  </Col>
}