// 接口的返回值类型
export type Res = {
	status?: number; // 状态，200成功
	code?: number; // 状态，0成功
	data?: any; // 返回的数据
	message?: string; // 返回的消息
};

// 表格分页
export type Page = {
	pageNum: number;
	pageSize: number;
	total: number;
};