/** table 相关内容 二次封装组件 **/

// ==================
// 第三方库
// ==================
import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from "react";
import { Form } from "antd";

// ==================
// 常量、工具库
// ==================
import { getItemJsx, getSelectDatas, getTips } from "../common";

// ==================
// 类型声明
// ==================
import { ColumnGroupType, ColumnsType, ColumnType } from "antd/lib/table";
import { ColProps } from "antd/lib/col";
import { NamePath } from "antd/lib/form/interface";
export type Props<T> = {
	config: ColumnsType<T>;
	layout?: {
		labelCol?: ColProps;
		wrapperCol?: ColProps;
	};
};

import "../index.less";

export type ProActionProps = {
	validateFields: (nameList?: NamePath[]) => Promise<any>;
	getFieldsValue: (
		nameList?: NamePath[],
		filterFunc?: (meta: { touched: boolean; validating: boolean }) => boolean
	) => Promise<any>;
	setFieldsValue: (v: any) => void;
	resetFields: () => void;
};

export default forwardRef(function ProAction<T>(props: Props<T>, ref: any) {
	const { config, layout } = props;

	const formItems = useMemo(() => config.filter((item: any) => item.action), [config]);

	const selectDatas = useMemo(() => getSelectDatas(config), [config]);

	const getFormItem = useCallback(
		(item: any) => {
			if (typeof item.action === "function") {
				return item.action();
			}
			return (
				<Form.Item
					key={item.dataIndex}
					label={item.title}
					name={item.dataIndex}
					rules={
						item.required
							? [
									{
										required: true,
										message: getTips(item),
									},
							  ]
							: undefined
					}
					{...item.formItemProps}
				>
					{getItemJsx(item, selectDatas, "action")}
				</Form.Item>
			);
		},
		[selectDatas]
	);

	const [form] = Form.useForm();

	// 暴露的实例方法
	useImperativeHandle(ref, () => ({
		async validateFields(nameList?: NamePath[]) {
			return await form.validateFields(nameList);
		},
		async getFieldsValue(
			nameList?: NamePath[],
			filterFunc?: (meta: { touched: boolean; validating: boolean }) => boolean
		) {
			return await form.getFieldsValue(nameList || true, filterFunc);
		},
		setFieldsValue(values: any) {
			form.setFieldsValue(values);
		},
		resetFields() {
			form.resetFields();
		},
	}));

	return (
		<Form form={form} className="action-form" {...(layout || {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 },
			},
		})}>
			{formItems.map((item: ColumnGroupType<T> | ColumnType<T>) => getFormItem(item))}
		</Form>
	);
});
