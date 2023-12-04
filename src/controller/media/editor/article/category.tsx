import Api from '../../../../service';
import { PropsWithoutRef, useMemo } from "react";
import { Select } from "antd";
import { useApplication } from "../../../../main";

export function Categories(props: PropsWithoutRef<{
  value: number,
  onChange: (c: number) => void
}>) {
  const app = useApplication();
  const { data } = app.useQuery(() => Api.Category.getDataSource(), {
    defaultValue: []
  })
  const options = useMemo(() => {
    return data.filter(c => !c.outable).map(category => ({
      label: category.name,
      value: category.id,
    })).concat([{
      label: '请选择分类',
      value: 0
    }])
  }, [data]);
  return <Select options={options} value={props.value} onChange={props.onChange} style={{ width: 300 }
  } />
}