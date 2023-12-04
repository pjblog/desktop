import Api from '../../service';
import styles from './index.module.less';
import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { AdminMiddlewaare } from "../../middleware/admin";
import { useApplication } from "../../main";
import { useCallback, useMemo } from 'react';
import { Loading } from '../../component/Loading';
import { Col, Pagination, Row } from 'antd';
import { SingleTon } from './sington';
import { Flex } from '../../component/Flex';

const Page = defineController<never, 'page' | 'keyword' | 'category' | 'type' | 'tag'>(LoginMiddleware, AdminMiddlewaare, Layout, (props) => {
  const app = useApplication();
  const _page = useMemo(() => Number(props.query.page || '1'), [props.query.page]);
  const _keyword = useMemo(() => props.query.keyword, [props.query.keyword]);
  const _category = useMemo(() => Number(props.query.category || '0'), [props.query.category]);
  const _type = useMemo(() => Number(props.query.type || '-1') as 0 | 1 | 2 | -1, [props.query.type]);
  const _tag = useMemo(() => props.query.tag, [props.query.tag]);
  const { data, loading, error, page, size, total, mutate } = app.useQuery(() => Api.Media.getMedias(_page, _keyword, _category, _type, _tag), {
    defaultValue: [],
    refreshDeps: [
      _page, _keyword, _category, _type, _tag,
    ]
  });
  const delone = useCallback((code: string) => {
    const value = [...data];
    const index = value.findIndex(val => val.code === code);
    if (index > -1) {
      value.splice(index, 1);
      mutate(value);
    }
  }, [data, mutate])
  return <Loading loading={loading} error={error}>
    <Row gutter={[0, 24]}>
      {
        data.map(media => {
          return <Col span={24} key={media.id} className={styles.media}>
            <SingleTon {...media} delone={delone} />
          </Col>
        })
      }
      <Col span={24}>
        <Flex align="center" valign="middle" block>
          <Pagination current={page} pageSize={size} total={total} onChange={p => {
            app.redirect(Page.path().query({
              page: p + '',
              keyword: _keyword,
              category: _category + '',
              type: _type + '',
              tag: _tag,
            }).toString());
          }} />
        </Flex>
      </Col>
    </Row>
  </Loading>
})

export default Page;