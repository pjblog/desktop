import styles from './style.module.less';
import { PropsWithoutRef, useEffect, useRef, useState } from "react";
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from '@codemirror/view';
import { syntaxHighlighting } from '@codemirror/language';
import { oneDark, oneDarkHighlightStyle } from "./theme";

export function Markdown(props: PropsWithoutRef<{
  value: string,
  onChange: (v: string) => void,
  strict?: boolean,
}>) {
  const dom = useRef<HTMLDivElement>();
  const editor = useRef<EditorView>();
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const view = new EditorView({
      parent: dom.current!
    })
    editor.current = view;
    return () => view.destroy();
  }, [])

  useEffect(() => {
    if (editor.current && !installed) {
      editor.current.setState(EditorState.create({
        doc: props.value || '请在此处输入内容 ...',  // 编辑器文本
        extensions: [
          lineNumbers({}), // 显示行号
          EditorView.lineWrapping, // 自动换行
          syntaxHighlighting(oneDarkHighlightStyle, { //语法高亮
            fallback: true
          }),
          markdown({ addKeymap: false }), // 支持markdown
          oneDark, // 给CodeMirror添加暗黑主题
          EditorView.updateListener.of(view => { // 监听编辑器内容的改动
            if (view.docChanged) {
              props.onChange(view.state.doc.toString());
            }
          })
        ]
      }))
      if (props.strict) {
        if (props.value) {
          setInstalled(true)
        }
      } else {
        setInstalled(true)
      }
    }
  }, [props.value])
  return <div className={styles.editor}>
    <div ref={dom} className={styles.markdown} />
  </div>
}