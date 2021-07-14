import React from "react";
import { DatePicker, Input, InputNumber, Radio, Select, TreeSelect } from "antd";
import RangePicker from "../DateRange/one";
import Editor from "../Editor";
// import UploadUni from "@/components/Upload/new";

export const getItemJsx = (obj: any, selectDatas: any, type?: string) => {
	const { valueType, title, typeProps, searchTypeProps } = obj;
	if (!valueType || valueType === "text") {
		return <Input placeholder={"请输入" + title} allowClear {...typeProps} />;
	} else if (valueType === "textarea") {
		return <Input.TextArea rows={4} showCount maxLength={300} autoSize={{ minRows: 6, maxRows: 6 }} {...typeProps} />;
	} else if (valueType === "select" || valueType === "enum" || valueType === "radio") {
		let options = selectDatas[obj.dataIndex] || [];
		if (type === "action") {
			if (valueType === "radio") {
				return <Radio.Group options={selectDatas[obj.dataIndex]} {...typeProps}></Radio.Group>;
			}
		} else {
			options = [
				{
					label: "全部",
					value: null,
				},
				...options,
			];
		}
		return (
			<Select
				placeholder={"请选择" + title}
				options={options}
				showSearch
				allowClear
				filterOption={(input, option: { label: string; value: number }) =>
					option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				{...typeProps}
			></Select>
		);
	} else if (valueType === "dateTime") {
		return type === "action" ? (
			<DatePicker
				placeholder={"请选择" + title}
				allowClear
				style={{
					width: "100%",
				}}
				{...typeProps}
			/>
		) : (
			<DatePicker
				placeholder={"请选择" + title}
				allowClear
				style={{
					width: "100%",
				}}
				{...searchTypeProps}
			/>
		);
	} else if (valueType === "dateRange") {
		return type === "action" ? (
			<RangePicker {...typeProps} />
		) : (
			<RangePicker {...searchTypeProps} />
		);
	} else if (valueType === "editor") {
		const { api, ...otherProps } = typeProps;
		return (
			<Editor
				api={api}
				defaultProps={{
					init: {
						content_style:
							"body{padding:0 15px!important;margin:0!important;margin: 0;font-size: 14px;font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variant: tabular-nums;line-height: 1.5715;-webkit-font-feature-settings: tnum;font-feature-settings: tnum;}p{padding:0;margin:0;overflow:hidden;*zoom:1;}img{margin-bottom: 5px;max-width:100%;height:auto}::-webkit-scrollbar{width: 6px;height: 6px;background-color: transparent;}::-webkit-scrollbar-thumb{background-color: #535353;}",
						width: "100%",
						height: 450,
						paste_webkit_styles: "all",
						// automatic_uploads: false,
						images_dataimg_filter: img => {
							return img.hasAttribute("internal-blob");
						},
					},
				}}
				{...otherProps}
			/>
		);
	// } else if (valueType === "upload") {
	// 	return <UploadUni {...typeProps} />;
	} else if (valueType === "order") {
		return (
			<InputNumber
				min={0}
				max={10000}
				placeholder="请输入排序号（数字越小排序越靠前）"
				style={{ width: "100%" }}
				{...typeProps}
			/>
		);
	} else if (valueType === "treeSelect") {
		return (
			<TreeSelect
				dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
				placeholder={"请选择" + title}
				treeData={selectDatas[obj.dataIndex]}
				{...typeProps}
			/>
		);
	}
	// else if (valueType === "cascader") {
	// 	return <Cascader options={selectDatas} loadData={obj.loadData} onChange={obj.onChange} changeOnSelect />;
	// }
	return null;
};

export const getSelectDatas = (columns: any[]) => {
	const arr: any = {};
	columns.forEach(async (item: any) => {
		if (item.valueType === "select" || item.valueType === "radio" || item.valueType === "treeSelect") {
			// 普通下拉选择、radio单选框、tree下拉选择
			if (Array.isArray(item.options)) {
				arr[item.dataIndex] = item.options;
			}
		} else if (item.valueType === "enum") {
			// 枚举下拉选择
			const opts = Object.entries(item.valueEnum).map((v: any): {
				label: string;
				value: string | number | undefined;
			} => {
				return {
					label: v[1].text,
					value: +v[0],
				};
			});
			arr[item.dataIndex] = opts;
		}
	});
	return arr;
};

export const getTips = (obj: any) => {
	const { valueType, title } = obj;
	if (valueType === "dateTime" || valueType === "select" || valueType === "enum" || valueType === "radio") {
		return "请选择" + title;
	} else {
		return "请输入" + title;
	}
};
