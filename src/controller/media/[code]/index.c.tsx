import Api from '../../../service';
import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../../middleware/login";
import { AdminMiddlewaare } from "../../../middleware/admin";
import { useApplication } from "../../../main";
import { MEDIA_TYPE } from '@pjblog/types';
import { Loading } from '../../../component/Loading';
import { PropsWithoutRef, useMemo } from 'react';
import { IArticlePoster } from '../../../service/media.type';
import { ArticleEditor } from '../editor/article';

export default defineController<'code'>(LoginMiddleware, AdminMiddlewaare, (props) => {
  const app = useApplication();
  const { data, loading, error } = app.useQuery(() => Api.Media.getType(props.params.code), {
    defaultValue: MEDIA_TYPE.ARTICLE,
    refreshDeps: [props.params.code]
  })
  return <Loading loading={loading} error={error}>
    <ChooseEditor value={data} code={props.params.code} />
  </Loading>
})

function ChooseEditor(props: PropsWithoutRef<{ value: MEDIA_TYPE, code: string }>) {
  switch (props.value) {
    case MEDIA_TYPE.ARTICLE:
      return <EditorWithArticle code={props.code} />
  }
}

function EditorWithArticle(props: PropsWithoutRef<{ code: string }>) {
  const app = useApplication();
  const { data, loading, error } = app.useQuery(() => Api.Article.info(props.code), {
    defaultValue: {},
    refreshDeps: [props.code],
  })
  const state = useMemo<Partial<IArticlePoster>>(() => {
    return Object.assign({}, data, { code: props.code });
  }, [data, props.code])
  return <Loading loading={loading} error={error}>
    <ArticleEditor {...state} />
  </Loading>
}