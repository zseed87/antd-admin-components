/** table 相关内容 二次封装组件 **/

// ==================
// 第三方库
// ==================
import React, { forwardRef, Key, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Badge, Button, Col, Form, Row, Space, Table, } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useTable, useWindowSize } from "@zseed/use-zseed";

// ==================
// 常量、工具库
// ==================
import { getItemJsx, getSelectDatas } from "../common";

// ==================
// 类型声明
// ==================
import { Page, Res } from "../../index.type";
import { ColumnType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";

export type ColumnsProps<T> = (ColumnType<T> & {
	title: string;
	dataIndex: string;
	width?: number | string;
	required?: boolean;
	search?: boolean | ((_: any, record: T) => React.ReactNode);
	table?: boolean | ((_: any, record: T) => React.ReactNode);
	action?: boolean | ((_: any, record: T) => React.ReactNode);
	valueType?:
		| "text"
		| "textarea"
		| "select"
		| "enum"
		| "radio"
		| "dateTime"
		| "dateRange"
		| "editor"
		| "upload"
		| "order"
		| "treeSelect";
	render?: (_: any, record: T) => React.ReactNode;
	options?: {
		label: string;
		value: string | number | undefined;
	}[];
	typeProps?: any;
	searchTypeProps?: any;
	formItemProps?: any;
	valueEnum?: any;
})[];

export type Props<T> = {
	columns: ColumnsProps<T>;
	request: (reqs: any) => Promise<Res>;
	parseData?: (data: T[], page?: Page) => Promise<T[]> | T[];
	listParams?: any;
	onChange?: (page: number, pageSize?: number) => void;
	noPagination?: boolean;
	action?: JSX.Element | JSX.Element[];
	checkbox?: boolean;
	beforeSearchSubmit?: (v: any) => any;
	page?: Page;
	radio?: boolean;
	scroll?: any;
	isScroll?: boolean;
	noPowerQuery?: boolean;
};

export type TableActionProps = {
	reload: (isCurrentPage?: boolean, callback?: (res: any) => void) => void;
	reloadAndRest: () => void;
	getData: () => any;
	setLoading: (b: boolean) => void;
	setSelecteds: (selectedRowKeys: number[]) => void;
	getSelecteds: () => number[];
	onSearchData: (params?: any, callback?: (res: any) => void) => void;
};

import "../index.less";

export default forwardRef(function ProTable<T>(props: Props<T>, ref: any) {
	const { columns, request, parseData, action, checkbox, radio, beforeSearchSubmit, ...otherProps } = props;
	const { width } = useWindowSize();

	const span = useMemo(() => {
		if (width > 1280) {
			return 6;
		} else if (width >= 768) {
			return 8;
		} else {
			return 12;
		}
	}, [width]);

	// 下拉框数据
	const selectDatas = useMemo(() => getSelectDatas(columns), [columns]);

	// 搜索项
	const tableItems = useMemo(() => columns.filter((item: any) => item.table || item.render), [columns]);

	// 表格列参数
	const tableColumns = useMemo(() => {
		return tableItems.map((item: any) => {
			const obj = {
				title: item.title,
				dataIndex: item.dataIndex,
				width: item.width,
			};
			if (item.render) {
				obj["render"] = item.render;
			} else if (item.valueEnum) {
				obj["render"] = (v: string | number) => {
					if (!v && v !== 0) {
						return "";
					}
					return item.valueEnum[v].color ? (
						<Badge color={item.valueEnum[v].color} text={item.valueEnum[v].text} />
					) : (
						<Badge status={item.valueEnum[v].status} text={item.valueEnum[v].text} />
					);
				};
			} else if (item.options && item.options.length && (item.valueType === "radio" || item.valueType === "select")) {
				obj["render"] = (v: string | number) => {
					if (!v && v !== 0) {
						return "";
					}
					return item.options.find((k: { label: string; value: number }) => k.value === v)?.label ?? "";
				};
			}
			return obj;
		});
	}, [tableItems]);

	// 搜索项
	const searchItems = useMemo(() => (props.noPowerQuery ? [] : columns.filter((item: any) => item.search)), [
		columns,
		props.noPowerQuery,
	]);

	// 搜索按钮偏移值
	const searchBtnOffset = useMemo(() => {
		const count = searchItems.length;
		const col = 24 / span;
		return (col - 1 - (count % col)) * span;
	}, [searchItems, span]);

	// 格式化表格数据
	const parseTableData = useCallback(
		(data: T[], pages?: Page) => {
			return parseData
				? parseData(data, pages)
				: data.map(item => {
						item["key"] = item["id"];
						return item;
				  });
		},
		[parseData]
	);

	const {
		//table属性参数
		tableProps,
		//设置加载状态
		setLoading,
		// 请求加载数据
		loadData,
		// 搜索加载数据
		searchData,
		// 当前数据
		data,
	} = useTable<any>({
		request: request,
		parseData: parseTableData,
		// table cols 字段
		columns: tableColumns,
		...otherProps,
	});
	const [form] = Form.useForm();

	// 是否显示更多搜索项
	const [moreSearch, setMoreSearch] = useState(false);

	const moreBtn = useMemo(() => {
		if (searchItems.length <= 3) {
			return null;
		}
		if (moreSearch) {
			return (
				<Button type="link" onClick={() => setMoreSearch(false)}>
					收起
					<UpOutlined />
				</Button>
			);
		} else {
			return (
				<Button type="link" onClick={() => setMoreSearch(true)}>
					展开
					<DownOutlined />
				</Button>
			);
		}
	}, [moreSearch, searchItems.length]);

	// 获取搜索表单项
	const getFormItem = useCallback(
		(item: any, idx: number) => {
			if (typeof item.search === "function") {
				return item.search(idx > 24 / span - 2 && !moreSearch);
			}
			return (
				<Form.Item
					hidden={idx > 24 / span - 2 && !moreSearch}
					label={item.title}
					name={item.dataIndex + "Search"}
					{...item.formItemProps}
				>
					{getItemJsx(item, selectDatas)}
				</Form.Item>
			);
		},
		[moreSearch, selectDatas, span]
	);

	const actionJSX = useMemo(() => {
		if (!action) {
			return null;
		}
		if (Array.isArray(action)) {
			return <Space>{action}</Space>;
		} else {
			return action;
		}
	}, [action]);

	// 搜索
	const onFinish = (values: any) => {
		const obj = {};
		for (const [key, value] of Object.entries(values)) {
			const k = key.replace("Search", "");
			obj[k] = value;
		}
		searchData(beforeSearchSubmit ? beforeSearchSubmit(obj) : obj);
	};

	// 重置
	const onReset = () => {
		form.resetFields();
		searchData({});
	};

	// 生命周期 - 首次加载组件时触发
	useEffect(() => {
		!props.noPowerQuery && loadData();
	}, []);

	// 当前表格选中项
	const [selecteds, setSelecteds] = useState<Key[]>([]);
	const rowSelection: TableRowSelection<object> = {
		onChange: (selectedRowKeys: Key[]) => {
			setSelecteds(selectedRowKeys);
		},
		selectedRowKeys: selecteds,
		type: radio ? "radio" : "checkbox",
	};
	// 暴露的实例方法
	useImperativeHandle(ref, () => ({
		// 刷新
		reload(isCurrentPage?: boolean, callback?: (res: any) => void) {
			loadData(isCurrentPage, callback);
		},
		// 刷新并清空,页码也会重置，包括表单
		reloadAndRest() {
			onReset();
		},
		// 获取当前表格数据
		getData() {
			return data;
		},
		// 表格loading
		setLoading(b: boolean) {
			setLoading(b);
		},
		// 设置checkbox
		setSelecteds(selectedRowKeys: number[]) {
			setSelecteds(selectedRowKeys);
		},
		// 获取所有选中项
		getSelecteds() {
			return selecteds;
		},
		onSearchData(params: any, callback?: (res: any) => void) {
			searchData(params, callback);
		},
	}));

	const customCls = useCallback((item: any) => {
		if (item.formItemProps && (item.formItemProps.labelCol || item.formItemProps.wrapperCol)) {
			return "custom-col";
		} else {
			return "default-col";
		}
	}, []);

	return (
		<div className="pro-table">
			{searchItems.length ? (
				<Form form={form} className="search-form" onFinish={onFinish}>
					<Row key={1} gutter={[16, 16]}>
						{searchItems.map((item: any, idx: number) => (
							<Col
								span={span}
								key={item.dataIndex}
								className={customCls(item) + (idx > 24 / span - 2 && !moreSearch ? " col-hidden" : "")}
							>
								{getFormItem(item, idx)}
							</Col>
						))}
						<Col span={span} offset={moreSearch ? searchBtnOffset : 0} key="searchBtn">
							<Form.Item className="search-btn">
								<Space>
									<Button htmlType="button" onClick={onReset}>
										重置
									</Button>
									<Button type="primary" htmlType="submit" loading={tableProps.loading}>
										搜索
									</Button>
									{moreBtn}
								</Space>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			) : null}
			{actionJSX ? <div className="table-action">{actionJSX}</div> : null}
			<Table
				{...tableProps}
				scroll={otherProps.isScroll ? otherProps.scroll : {}}
				rowSelection={checkbox ? rowSelection : undefined}
			/>
		</div>
	);
});
