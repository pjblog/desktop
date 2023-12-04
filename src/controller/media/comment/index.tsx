import Api from '../../../service';
import styles from './style.module.less';
import { PropsWithoutRef, useState } from "react";
import { useApplication } from "../../../main";
import { Loading } from '../../../component/Loading';
import { Col, Pagination, Row, Empty } from 'antd';
import { Comment } from './comment';

export function Comments(props: PropsWithoutRef<{ code: string }>) {
  const app = useApplication();
  const [_page, setPage] = useState(1);
  const { data, page, size, total, loading, error } = app.useQuery(() => Api.Media.comments(props.code, _page), {
    defaultValue: [],
    refreshDeps: [props.code, _page]
  })
  return <Loading loading={loading} error={error}>
    <Row>
      <Col span={24}>
        {
          !!data.length
            ? <Row>
              {
                data.map(comment => {
                  return <Col span={24} key={comment.id}>
                    <Comment {...comment} />
                  </Col>
                })
              }
            </Row>
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </Col>
      {!!data.length && <Col span={24} >
        <div className={styles.poster}>
          <Pagination
            current={page}
            pageSize={size}
            total={total}
            onChange={p => setPage(p)}
            size="small"
          />
        </div>
      </Col>}
    </Row>
  </Loading>
}