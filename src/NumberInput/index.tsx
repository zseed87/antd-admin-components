/** 限制输入数字的输入框 **/

// ==================
// 第三方库
// ==================
import React, { ChangeEvent, FC } from "react";
import { Input } from "antd";
// ==================
// 组件
// ==================

// ==================
// 类型声明
// ==================
import { InputProps } from "antd/lib/input";

export type NumberProps = InputProps & {
	value?: string;
};

const NumberInput: FC<NumberProps> = (props: NumberProps) => {
	const { value, onChange, ...otherProps } = props;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.target.value = e.target.value.replace(/[^\-?\d.]/g, "");
		onChange && onChange(e);
	};

	return <Input {...otherProps} onChange={handleChange} value={value} />;
};

export default NumberInput;
