import { Select } from 'antd';
import { isString } from 'lodash';
import { useState } from 'react';
const { Option } = Select;
const isStringArray = (
  options: string[] | CommonType.Option[]
): options is string[] => isString(options[0]);
export default function useUnitSelect(
  unitOptions: string[] | CommonType.Option[]
) {
  let options: CommonType.Option[] = [];
  if (isStringArray(unitOptions)) {
    options = unitOptions.map(item => ({ value: item, label: item }));
  }else {
    options = unitOptions;
  }
  const [value, setValue] = useState(options[0]?.value);
  const comp = (
    <Select
      defaultValue={options[0]?.value}
      style={{ width: 60 }}
      value={value}
      onChange={setValue}
    >
      {options.map((op, idx) => (
        <Option value={op.value} key={idx}>{op.label}</Option>
      ))}
    </Select>
  );
  return {comp, value, setValue};
}
