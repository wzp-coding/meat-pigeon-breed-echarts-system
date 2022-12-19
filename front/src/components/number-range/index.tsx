import { InputNumber } from 'antd';
import React, { useRef } from 'react';

interface Props {
  defaultValues?: number[];
  onChange: (values: number[]) => void;
  unit?: React.ReactNode;
}
const NumberRange: React.FC<Props> = ({
  defaultValues = [0, 0],
  onChange,
  unit = '',
}) => {
  const leftNum = useRef(0);
  const rightNum = useRef(0);
  return (
    <div className="wrapper" style={{ display: 'flex' }}>
      <InputNumber
        min={0}
        defaultValue={defaultValues[0]}
        onChange={num => {
          leftNum.current = num;
          onChange([num, rightNum.current || defaultValues[1] || 0]);
        }}
        addonAfter={unit}
      />
      &nbsp;~&nbsp;
      <InputNumber
        min={0}
        defaultValue={defaultValues[1]}
        onChange={num => {
          rightNum.current = num;
          onChange([leftNum.current || defaultValues[0] || 0, num]);
        }}
        addonAfter={unit}
      />
    </div>
  );
};

export default React.memo(NumberRange);
