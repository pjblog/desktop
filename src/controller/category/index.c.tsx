import styles from './index.module.less';
import Api from '../../service';
import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { useApplication, useMessage } from "../../main";
import { Button, Col, Input, Row, Space, Switch, Typography } from 'antd';
import { Loading } from '../../component/Loading';
import { Flex } from '../../component/Flex';
import { MenuOutlined, EditOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons'
import { PropsWithoutRef, useCallback, useState } from 'react';
import { ICategory } from '../../service/category.type';
import { AddCategory } from './addone';
import { useRequest } from 'ahooks';
import { RemoveCategory } from './delone';
import { DNDProvider, useCards } from './dnd';
import { useDrag, useDrop } from 'react-dnd'
import { AdminMiddlewaare } from '../../middleware/admin';

export default defineController(LoginMiddleware, AdminMiddlewaare, Layout, DNDProvider, () => {
  const app = useApplication();
  const { data, loading, error, mutate } = app.useQuery(() => Api.Category.getDataSource(), {
    defaultValue: [],
  })

  const { find, move, change } = useCards(data, mutate);
  const addone = useCallback((category: ICategory) => {
    mutate([...data, category]);
  }, [data, mutate])

  const delone = useCallback((id: number) => {
    const value = [...data];
    const index = value.findIndex(cate => cate.id === id);
    if (id > -1) {
      value.splice(index, 1);
      mutate(value);
    }
  }, [mutate, data]);

  return <Loading loading={loading} error={error}>
    <Row gutter={[0, 16]}>
      {
        data.map((category) => {
          return <Category
            key={category.id}
            {...category}
            delone={() => delone(category.id)}
            find={find}
            move={move}
            change={change}
          />
        })
      }
      <Col span={24}>
        <AddCategory action={addone} />
      </Col>
    </Row>
  </Loading>
})

function Category(props: PropsWithoutRef<ICategory & {
  delone: () => void,
  find: (id: number) => {
    card: ICategory;
    index: number;
  },
  move: (id: number, index: number) => void,
  change: () => void,
}>) {
  const msg = useMessage()
  const originalIndex = props.find(props.id).index;
  const [debug, setDebug] = useState(false);
  const [name, setName] = useState(props.name);
  const [link, setLink] = useState(props.link);
  const [outable, setOutable] = useState(props.outable);
  const { loading, runAsync } = useRequest(Api.Category.update.bind(Api.Category) as typeof Api.Category.update, {
    manual: true,
  })

  const update = useCallback(() => {
    runAsync(props.id, name, outable ? link : null)
      .then(() => setDebug(false))
      .then(() => msg.success('更新成功'))
      .catch(e => msg.error(e.message))
  }, [runAsync, name, outable, link])

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: 'box',
    item: {
      id: props.id,
      originalIndex,
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    end: (item, monitor) => {
      const { id: droppedId, originalIndex } = item
      const didDrop = monitor.didDrop()
      if (!didDrop) {
        props.move(droppedId, originalIndex)
      }
    },
  }), [props.id, originalIndex, props.move]);

  const [, drop] = useDrop(
    () => ({
      accept: 'box',
      //@ts-ignore
      hover({ id: draggedId }: Item) {
        if (draggedId !== props.id) {
          const current = props.find(props.id);
          if (current) {
            props.move(draggedId, current.index);
          }
        }
      },
      drop() {
        props.change();
      }
    }),
    [props.find, props.move, props.id],
  )

  return <Col span={24} ref={preview} style={{ opacity }}>
    <Flex className={styles.category} valign="middle" align="between" gap={24}>
      <Flex valign="middle" span={1}>
        <Typography.Text type="secondary" className={styles.handler} ref={(node) => drag(drop(node))}><MenuOutlined /></Typography.Text>
        <div className={styles.outable}>
          <Switch checked={outable} onChange={e => setOutable(e)} checkedChildren="外链" unCheckedChildren="分类" disabled={!debug} />
        </div>
        <Flex span={1} gap={24}>
          <Flex span={1} scroll="hide">
            {
              debug
                ? <Input value={name} onChange={e => setName(e.target.value)}></Input>
                : name
            }
          </Flex>
          <Flex span={1} scroll="hide">
            {
              debug
                ? <Input value={link} onChange={e => setLink(e.target.value)} disabled={!outable} />
                : <Typography.Text type="secondary">{link}</Typography.Text>
            }
          </Flex>
        </Flex>
      </Flex>
      <Space>
        {!debug && <Button icon={<EditOutlined />} onClick={() => setDebug(true)}></Button>}
        {debug && <Button danger icon={<CloseOutlined />} onClick={() => setDebug(false)}></Button>}
        {!debug && <RemoveCategory id={props.id} action={props.delone} />}
        {debug && <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={update}></Button>}
      </Space>
    </Flex>
  </Col>
}