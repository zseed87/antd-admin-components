import React, { FC, useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import "./index.less";

export type DateRangeProps = {
	value?: [string, string];
	onChange?: (v?: string[]) => void;
	minDate?: Date;
	maxDate?: Date;
	placeholderStart?: string;
	placeholderEnd?: string;
	format?: string;
};

const FromDateRange: FC<DateRangeProps> = (props: DateRangeProps) => {
	const { value, onChange, minDate, maxDate, placeholderStart, placeholderEnd, format } = props;

	const [startTime, setStartTime] = useState<string>(value ? value[0] : "");
	const [endTime, setEndTime] = useState<string>(value ? value[1] : "");

	useEffect(() => {
		if (value) {
			setStartTime(value[0]);
			setEndTime(value[1]);
		} else {
			setStartTime("");
			setEndTime("");
		}
	}, [value]);

	const handleChange = (_: any, dateString: string, type: string) => {
		if (type === "start") {
			setStartTime(dateString);
			onChange && onChange([dateString, endTime]);
		} else {
			setEndTime(dateString);
			onChange && onChange([startTime, dateString]);
		}
	};

	return (
		<Space className="range-wrap" size="middle">
			<DatePicker
				disabledDate={d => {
					if (minDate) {
						if (d && d.unix() < dayjs(minDate).unix()) {
							return true;
						}
					}
					if (endTime) {
						return d && d.unix() > dayjs(endTime).unix();
					} else {
						if (maxDate) {
							if (d && d.unix() > dayjs(maxDate).unix()) {
								return true;
							}
						}
						return false;
					}
				}}
				format={format || "YYYY-MM-DD"}
				value={startTime ? (dayjs(startTime) as any) : null}
				onChange={(date: any, dateString: string) => handleChange(date, dateString, "start")}
				placeholder={placeholderStart || "请选择开始日期"}
				style={{ width: "100%" }}
			/>
			<DatePicker
				disabledDate={d => {
					if (maxDate) {
						if (d && d.unix() > dayjs(maxDate).unix()) {
							return true;
						}
					}
					if (startTime) {
						return d && d.unix() < dayjs(startTime).unix();
					} else {
						if (minDate) {
							if (d && d.unix() < dayjs(minDate).unix()) {
								return true;
							}
						}
						return false;
					}
				}}
				format={format || "YYYY-MM-DD"}
				value={endTime ? (dayjs(endTime) as any) : null}
				onChange={(date: any, dateString: string) => handleChange(date, dateString, "end")}
				placeholder={placeholderEnd || "请选择结束日期"}
				style={{ width: "100%" }}
			/>
		</Space>
	);
};

export default FromDateRange;
