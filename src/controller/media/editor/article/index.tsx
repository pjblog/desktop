import Api from '../../../../service';
import styles from './index.module.less';
import { PropsWithoutRef, useCallback, useEffect, useMemo, useState } from "react";
import { Flex } from "../../../../component/Flex";
import { Button, Input, Space } from "antd";
import { Categories } from './category';
import { Tags } from './tags';
import { Markdown } from './markdown';
import { Source } from './source';
import { parse } from 'marked';
import { PicRightOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { IArticlePoster } from '../../../../service/media.type';
import { useMessage } from '../../../../main';
import { Title } from './title';

interface ArticleEditorProps extends Partial<IArticlePoster> {
  code?: string,
}

export function ArticleEditor(props: PropsWithoutRef<ArticleEditorProps>) {
  const msg = useMessage();
  const [preview, setPreview] = useState(true);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [markdown, setMarkdown] = useState(props.markdown);
  const [category, setCategory] = useState(props.category || 0);
  const [tags, setTags] = useState(props.tags || []);
  const [source, setSource] = useState(props.source || []);
  const html = useMemo(() => markdown ? parse(markdown) : null, [markdown]);

  const { loading, runAsync } = useRequest(() => {
    const data: IArticlePoster = {
      title, description, markdown, category,
      tags: tags.filter(Boolean),
      source: source.filter(Boolean),
    }
    return props.code
      ? Api.Article.update(props.code, data)
      : Api.Article.addone(data)
  }, {
    manual: true
  })

  const submit = useCallback(() => {
    if (!title) return msg.warning('请填写文章标题');
    if (!description) return msg.warning('文章摘要是必须的');
    if (!markdown) return msg.warning('文章内容是必须的');
    if (!category) return msg.warning('请选择合适的分类');

    runAsync()
      .then(() => msg.success(props.code ? '更新成功' : '发表成功'))
      .catch(e => msg.error(e.message));
  }, [runAsync, props.code, title, description, markdown, category])

  useEffect(() => setTitle(props.title), [props.title]);
  useEffect(() => setDescription(props.description), [props.description]);
  useEffect(() => setMarkdown(props.markdown), [props.markdown]);
  useEffect(() => setCategory(props.category || 0), [props.category]);
  useEffect(() => setTags(props.tags || []), [props.tags]);
  useEffect(() => setSource(props.source || []), [props.source]);

  return <Flex block full scroll="hide" direction="vertical" className={styles.editor}>
    <Flex block className={styles.title} gap={24} valign="middle">
      <Flex span={1}>
        <Input placeholder="文章标题" size="large" value={title} bordered={false} onChange={e => setTitle(e.target.value)} />
      </Flex>
      <Categories value={category} onChange={setCategory} />
    </Flex>
    <Flex block className={styles.tools} gap={24} valign="middle">
      <Flex span={1}><Tags value={tags} onChange={setTags} /></Flex>
      <Space>
        <Button type={preview ? "primary" : 'default'} icon={<PicRightOutlined />} onClick={() => setPreview(!preview)}></Button>
        <Button type="primary" danger loading={loading} onClick={submit}>保存</Button>
      </Space>
    </Flex>
    <Flex span={1} block>
      <Flex span={6} full className={styles.extra} direction="vertical" scroll='hide'>
        <Flex span={1} scroll="hide" className={styles.summary} block direction="vertical" gap={[0, 8]}>
          <Title name="摘要" type="warning">
            <Markdown value={description} onChange={setDescription} strict={!!props.code} />
          </Title>
        </Flex>
        <Flex span={1} scroll="y" block direction="vertical" gap={[0, 8]}>
          <Title name="参考 / 来源" type="warning" padding>
            <Source value={source} onChange={setSource} />
          </Title>
        </Flex>
      </Flex>
      <Flex span={preview ? 10 : 19} full scroll="y" direction="vertical">
        <Title name="正文" type="warning">
          <Markdown value={markdown} onChange={setMarkdown} strict={!!props.code} />
        </Title>
      </Flex>
      {preview && <Flex span={8} full scroll="hide" className={styles.preview} direction="vertical">
        <Title name="预览" type="warning" padding>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Title>
      </Flex>}
    </Flex>
  </Flex>
}