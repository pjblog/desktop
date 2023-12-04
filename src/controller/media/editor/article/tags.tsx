import { PropsWithoutRef, useEffect, useRef, useState } from "react";
import { Input, Tag, theme } from 'antd';
import type { InputRef } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';

export function Tags(props: PropsWithoutRef<{
  value: string[],
  onChange: (ts: string[]) => void
}>) {
  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  const handleClose = (removedTag: string) => {
    const newTags = props.value.filter((tag) => tag !== removedTag);
    console.log(newTags);
    props.onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && props.value.indexOf(inputValue) === -1) {
      props.onChange([...props.value, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = props.value.map(forMap);

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };


  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  return <>
    <div>
      <TweenOneGroup
        enter={{
          scale: 0.8,
          opacity: 0,
          type: 'from',
          duration: 100,
        }}
        onEnd={(e) => {
          if (e.type === 'appear' || e.type === 'enter') {
            (e.target as any).style = 'display: inline-block';
          }
        }}
        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
        appear={false}
      >
        {tagChild}
      </TweenOneGroup>
    </div>
    {inputVisible ? (
      <Input
        ref={inputRef}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    ) : (
      <Tag onClick={showInput} style={tagPlusStyle}>
        <PlusOutlined /> 新标签
      </Tag>
    )}
  </>
}