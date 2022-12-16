import { InputNumber } from 'antd';
import React, { useRef } from 'react';

interface Props {
  defaultValues?: number[];
  onChange: (values: number[]) => void;
}
const NumberRange: React.FC<Props> = ({
  defaultValues = [0, 0],
  onChange,
}) => {
  const leftNum = useRef(0);
  const rightNum = useRef(0);
  return (
    <>
      <InputNumber
        min={0}
        defaultValue={defaultValues[0]}
        onChange={num => {
          leftNum.current = num;
          onChange([num, rightNum.current || defaultValues[1]]);
        }}
        />
      &nbsp;~&nbsp;
      <InputNumber
        min={0}
        defaultValue={defaultValues[1]}
        onChange={num => {
          rightNum.current = num;
          onChange([leftNum.current || defaultValues[0], num]);
        }}
      />
    </>
  );
};

export default React.memo(NumberRange);
