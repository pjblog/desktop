import styles from './index.module.less';
import classnames from 'classnames';
import { PropsWithoutRef, useMemo } from "react";
import { Flex } from "../Flex";
import { Input, Typography } from "antd";
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { BlogDesktopThemeSmall } from '../Theme/Small';
import { CheckOutlined, NotificationOutlined } from '@ant-design/icons';

const rules: ((v: string) => boolean)[] = [
  v => v.length >= 8,
  v => /[0-9]/.test(v),
  v => /[A-Z]/.test(v),
  v => /[^A-Za-z0-9]/.test(v),
]

const match = (value: string, index: number) => {
  if (!value) return false;
  return rules[index](value);
}

export function Password(props: PropsWithoutRef<{
  value: string,
  onChange: (val: string) => void,
  placeholder?: string,
  tips?: string,
  size?: SizeType,
}>) {
  const m1 = useMemo(() => match(props.value, 0), [props.value]);
  const m2 = useMemo(() => match(props.value, 1), [props.value]);
  const m3 = useMemo(() => match(props.value, 2), [props.value]);
  const m4 = useMemo(() => match(props.value, 3), [props.value]);
  const level = useMemo(() => Password.level(props.value), [props.value]);
  return <Flex direction="vertical" block className={styles.password} gap={[0, 8]}>
    <Flex direction="vertical" block gap={[0, 8]}>
      <Input.Password
        size={props.size}
        placeholder={props.placeholder}
        allowClear value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
      <Flex block className={styles.strongs} gap={8}>
        <Flex span={1} className={classnames(styles.strong, {
          [styles.active]: level >= 1
        })} full></Flex>
        <Flex span={1} className={classnames(styles.strong, {
          [styles.active]: level >= 2
        })} full></Flex>
        <Flex span={1} className={classnames(styles.strong, {
          [styles.active]: level >= 3
        })} full></Flex>
        <Flex span={1} className={classnames(styles.strong, {
          [styles.active]: level === 4
        })} full></Flex>
      </Flex>
    </Flex>
    <BlogDesktopThemeSmall>
      <Typography.Text type="warning" className={styles.tips}><NotificationOutlined /> 密码强度规则</Typography.Text>
      <Flex align="between" block>
        <Typography.Text type="secondary" className={styles.tips}>1. 密码长度必须大于等于8个字符</Typography.Text>
        {m1 && <CheckOutlined className={styles.checked} />}
      </Flex>
      <Flex align="between" block>
        <Typography.Text type="secondary" className={styles.tips}>2. 密码必须包含数字</Typography.Text>
        {m2 && <CheckOutlined className={styles.checked} />}
      </Flex>
      <Flex align="between" block>
        <Typography.Text type="secondary" className={styles.tips}>3. 密码必须包含大写字母</Typography.Text>
        {m3 && <CheckOutlined className={styles.checked} />}
      </Flex>
      <Flex align="between" block>
        <Typography.Text type="secondary" className={styles.tips}>4. 密码必须包含特殊字符</Typography.Text>
        {m4 && <CheckOutlined className={styles.checked} />}
      </Flex>
    </BlogDesktopThemeSmall>
  </Flex>
}

Password.level = (value: string) => {
  if (!value) return 0;
  return rules.reduce((prev, next) => {
    return prev + Number(next(value))
  }, 0)
};

Password.validate = (value: string) => Password.level(value) === 4;