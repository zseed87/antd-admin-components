import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Input, message, Modal } from "antd";
import { AimOutlined, SearchOutlined } from "@ant-design/icons";
import loadMap from "./amap/loadMap";

import "./style.less";
import { useInput } from "@zseed/use-zseed";

let AMap: any = null;
let map: any = null;
let marker: any = null;
let geolocation: any = null;
let geocoder: any = null;

export type PointProps = {
	lnglat: string;
	address: string;
	detailInfo: any;
};

interface Props { 
	value?: PointProps;
	onChange?: (v: PointProps) => void;
}

const MapCoordinate: FC<Props> = (props: Props) => {
	const { value, onChange } = props;

	const [visible, setVisible] = useState(false);
	const [pointInfoDetail, setPointInfoDetail] = useState();
	const [address, setAddress] = useState(value?.address || "");
	const [lnglat, setLnglat] = useState(value?.lnglat || "");

	// 搜索相关参数
	const [nameProps, searchName, setName] = useInput(); // 名称

	// const [markerTemplate, setMarkerTemplate] = useState<any>();
	// const [geocoderTemplate, setGeocoderTemplate] = useState<any>();

	useEffect(() => {
		return () => {
			AMap = null;
			map = null;
			marker = null;
			geolocation = null;
			geocoder = null;
		};
	}, []);

	const afterClose = () => {
		map = null;
		marker = null;
		geolocation = null;
		geocoder = null;
		setName("");
	};

	const onOk = () => {
		onChange &&
			onChange({
				lnglat: lnglat,
				address: address,
				detailInfo: pointInfoDetail,
			});
		toggle(false);
	};

	const toggle = useCallback((v: boolean) => {
		setVisible(v);
	}, []);

	const getAddress = useCallback((geocoder: any, lnglat: AMap.LngLat) => {
		geocoder.getAddress(lnglat, function (status: string, result: any) {
			if (status === "complete" && result.regeocode) {
				console.log(result);
				setPointInfoDetail(result);
				console.log(result.regeocode.formattedAddress);
				setAddress(result.regeocode.formattedAddress);
				const position = marker.getPosition();
				setLnglat(position.lng + ", " + position.lat);
			} else {
				console.error("根据经纬度查询地址失败");
			}
		});
	}, []);

	const updateAddress = useCallback(
		async (lnglat: AMap.LngLat) => {
			if (geocoder) {
				getAddress(geocoder, lnglat);
			} else {
				AMap.service("AMap.Geocoder", function () {
					// 回调函数
					geocoder = new AMap.Geocoder({});
					getAddress(geocoder, lnglat);
				});
			}
		},
		[getAddress]
	);

	const initMap = useCallback(
		async (position: any) => {
			map = new AMap.Map("formMap", {
				zoom: 15,
				center: position,
			});
			map.addControl(geolocation);
			// map.setCenter(position);
			// 创建点覆盖物
			marker = new AMap.Marker({
				position: position,
				draggable: true,
				cursor: "move",
				// icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
				// offset: new AMap.Pixel(-13, -30)
			});

			await updateAddress(position);
			map.add(marker);
			//为地图注册click事件获取鼠标点击出的经纬度坐标
			map.on("click", function (e: AMap.MapsEvent) {
				marker.setPosition(e.lnglat);
				updateAddress(e.lnglat);
			});
			marker.on("dragend", function (e: AMap.MapsEvent) {
				updateAddress(e.lnglat);
			});
		},
		[updateAddress]
	);

	const getCurrentPosition = useCallback(async () => {
		AMap =
			AMap ||
			(await loadMap({
				plugins: ["AMap.Geocoder", "AMap.Geolocation", "AMap.PlaceSearch"],
			}));
		AMap.plugin("AMap.Geolocation", function () {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：5s
				buttonPosition: "RB", //定位按钮的停靠位置
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				panToLocation: false, //定位成功后是否自动调整地图视野到定位点
				showMarker: false,
				showCircle: false,
			});
			geolocation.getCurrentPosition(async function (status: string, result: any) {
				if (status == "complete") {
					if (value?.lnglat) {
						initMap(value.lnglat.split(","));
					} else {
						initMap(result.position);
					}
				} else {
					message.error("定位失败，请重新再试！");
					console.error(result);
				}
			});
		});
	}, [initMap, value?.lnglat]);

	const search = () => {
		geocoder.getLocation(searchName, function (status: string, result: any) {
			if (status === "complete" && result.geocodes && result.geocodes.length) {
				const position = result.geocodes[0].location;
				map.setCenter(position);
				setAddress(result.geocodes[0].formattedAddress);
				setLnglat(position.lng + ", " + position.lat);
				marker.setPosition(position);
			} else {
				console.error("查询地址失败");
			}
		});
	};

	const show = () => {
		setVisible(true);
		setTimeout(() => {
			getCurrentPosition();
		});
	};

	return (
		<>
			<div className="map-coordinate-wrap">
				<Button type="primary" icon={<AimOutlined />} onClick={show}>
					拾取坐标
				</Button>
				{value?.address && value?.lnglat ? (
					<div className="coordinate-value">
						{value.address}（经纬度：{value.lnglat}）
					</div>
				) : null}
			</div>
			{visible ? (
				<Modal
					title="拾取坐标"
					onCancel={_e => toggle(false)}
					visible={visible}
					maskClosable={false}
					onOk={onOk}
					afterClose={afterClose}
					width={840}
					className="map-modal"
				>
					<div className="g-search">
						<ul className="search-ul">
							<li>
								<Input placeholder="请输入关键字进行搜索" {...nameProps} />
							</li>
							<li>
								<Button type="primary" icon={<SearchOutlined />} onClick={search}>
									搜索
								</Button>
							</li>
						</ul>
					</div>
					{address && lnglat ? (
						<div className="address">
							{address}（经纬度：{lnglat}）
						</div>
					) : null}
					<div id="formMap"></div>
				</Modal>
			) : null}
		</>
	);
};

export default MapCoordinate;
