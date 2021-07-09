/** table 相关内容 二次封装组件 **/

// ==================
// 第三方库
// ==================
import React, { useCallback, useMemo } from "react";

// ==================
// 常量、工具库
// ==================

// ==================
// 类型声明
// ==================
import { ColumnGroupType, ColumnsType, ColumnType } from "antd/lib/table";
export type Props<T> = {
	config: ColumnsType<T>;
	data: T | undefined;
};

import "../index.less";

export default function ProAction<T>(props: Props<T>) {
	const { config, data } = props;

	const descItems = useMemo(() => config.filter((item: any) => item.detail), [config]);

	const getDescValue = useCallback(
		(obj: any) => {
			if (!data) {
				return "-";
			}
			if (typeof obj.detail === "function") {
				return obj.detail(data);
			} else if (obj.valueType === "enum") {
				return obj.valueEnum[data[obj.dataIndex]].text;
			} else {
				return data[obj.dataIndex];
			}
		},
		[data]
	);

	const getDescItem = useCallback(
		(obj: any) => {
			if (obj.valueType === "editor") {
				return (
					<div className="desc-edtior-wrap">
						<div className="desc-title">{obj.title}：</div>
						<div
							className="desc-content"
							dangerouslySetInnerHTML={{
								__html: data ? data[obj.dataIndex] : "",
							}}
						></div>
					</div>
				);
			} else {
				return (
					<div key={obj.dataIndex} className="desc-item">
						<div className="desc-label">{obj.title}：</div>
						<div className="desc-content">{getDescValue(obj)}</div>
					</div>
				);
			}
		},
		[data, getDescValue]
	);

	return <div className="pro-desc">{descItems.map((item: ColumnGroupType<T> | ColumnType<T>) => getDescItem(item))}</div>;
}
