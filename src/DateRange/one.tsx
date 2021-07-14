import React, { FC, useMemo } from "react";
import { DatePicker } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import dayjs from "dayjs";

function range(start: number, end: number) {
	const result = [];
	for (let i = start; i < end; i++) {
		result.push(i);
	}
	return result;
}

export type DateRangeProps = RangePickerProps & {
	value?: [string, string];
	onChange?: (v?: string[]) => void;
	minDate?: Date | string;
	maxDate?: Date | string;
	minTime?: number; //(秒)
	format?: string;
};

const FromDateRange: FC<DateRangeProps> = (props: DateRangeProps) => {
	const { value, onChange, minDate, maxDate, minTime, format, ...otherProps } = props;

	const v: any | undefined = useMemo(() => {
		if (value) {
			const x: [string, string] = value;
			return x.map(item => dayjs(item));
		} else {
			return undefined;
		}
	}, [value]);

	const handleChange = (_: any, dateStrings: [string, string]) => {
		if (!dateStrings[0] && !dateStrings[1]) {
			onChange && onChange(undefined);
		} else {
			onChange &&
				onChange(
					dateStrings.map(item => {
						return dayjs(item).format(format || "YYYY-MM-DD HH:mm:ss");
					})
				);
		}
	};

	return (
		<DatePicker.RangePicker
			value={v}
			onChange={handleChange}
			disabledDate={d => {
				if (maxDate) {
					if (d && d.unix() > dayjs(maxDate).unix()) {
						return true;
					}
				}
				if (minDate) {
					if (d && d.unix() < dayjs(minDate).unix()) {
						return true;
					}
				}
				return false;
			}}
			disabledTime={(_, type) => {
				if (type === "start" && minDate) {
					const current = dayjs(minDate).valueOf() + (minTime || 0) * 1000;
					const d = new Date(current);
					const hour = d.getHours();
					const minutes = d.getMinutes();
					return {
						disabledHours: () => range(0, 23).splice(0, hour),
						disabledMinutes: (h: number) => {
							const r = range(0, 59);
							if (h === hour) {
								return r.splice(0, minutes);
							} else {
								return [];
							}
						},
					};
				} else {
					return {};
				}
			}}
			{...otherProps}
		/>
	);
};

export default FromDateRange;
