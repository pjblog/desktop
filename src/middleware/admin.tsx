import { PropsWithChildren } from "react";
import { useProfile } from "./login";
import { Result } from "antd";

export function AdminMiddlewaare(props: PropsWithChildren) {
  const { data } = useProfile();
  if (data.admin) return props.children;
  return <Result
    status="403"
    title="403"
    subTitle="你没有此页面的访问权限"
  />
}