/**
 * 异步加载高德地图
 *
 * @export
 * @param {*} key 高德地图key
 * @param {*} plugins 高德地图插件
 * @param {string} version 高德地图版本
 * @returns
 */
import AMapLoader from "@amap/amap-jsapi-loader";

const v = "1.4.15";
const key = "7c4520679f42fd63aabd22c9f94f2165";
const plugins = ["AMap.Geocoder"];

export default function loadMap(config?: {
	version?: string;
	key?: string;
	plugins?: string[];
	AMapUI?: {
		version: string;
		plugins: string[];
	};
	Loca?: {
		version: string;
	};
}): Promise<any> {
	return new Promise(async (resolve, reject) => {
		AMapLoader.load({
			key: config?.key || key, // 申请好的Web端开发者Key，首次调用 load 时必填
			version: config?.version || v, // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
			plugins: config?.plugins || plugins, // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			AMapUI: config?.AMapUI || {
				// 是否加载 AMapUI，缺省不加载
				version: "1.1", // AMapUI 缺省 1.1
				plugins: [], // 需要加载的 AMapUI ui插件
			},
			Loca: config?.Loca || {
				// 是否加载 Loca， 缺省不加载
				version: "1.3.2", // Loca 版本，缺省 1.3.2
			},
		})
			.then(AMap => {
				return resolve(AMap);
			})
			.catch(e => {
				console.error(e);
				return reject(e);
			});
	});
}
