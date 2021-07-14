/**
 * 富文本编辑器
 * 文档：http://tinymce.ax-z.cn/
 */
import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { IProps } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";

interface Props {
	api: (file: File) => false | Promise<any>;
	value?: string;
	onChange?: (v: string) => void;
	defaultProps?: Partial<IProps>;
}

class CustomEditor extends React.Component<Props> {
	handleEditorChange = (content: string) => {
		this.props.onChange && this.props.onChange(content);
	};

	handleUpload = async (blobInfo: any, succFun: (s: string) => void, failFun: (s: string) => void) => {
		const file = blobInfo.blob(); // 转化为易于理解的file对象
		try {
			const request = this.props.api;
			const res: any = await request(file);
			if (res && res.code === 200) {
				succFun(res.data.fileName);
			} else {
				failFun(res.message);
			}
		} catch (error) {
			failFun(error);
		}
	};

	render() {
		const defaultProps = this.props.defaultProps || {
			init: {},
		};

		const { init, ...otherProps } = defaultProps;

		const defaultInit = {
			// setup: function(editor) {
			//   console.log("编辑器即将初始化.");
			// },
			// init_instance_callback : function(editor) {
			//   console.log("ID为: " + editor.id + " 的编辑器已初始化完成.");
			// },
			// preview  不能设置窗口大小，暂时不用 fullscreen
			resize: false,
			statusbar: false,
			paste_data_images: true,
			language: "zh_CN",
			fontsize_formats: "8px 10px 12px 14px 16px 18px 24px 36px",
			plugins: [
				"advlist autolink lists link image charmap print anchor",
				"searchreplace visualblocks code",
				"insertdatetime media table paste code wordcount",
			],
			toolbar:
				"undo redo formatselect fontselect fontsizeselect bold italic backcolor forecolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat",
			// 显示的自定义字体 以 xx = xx 形式显示
			font_formats:
				"宋体=SimSun;微软雅黑=Microsoft Yahei;华文黑体=STHeiti;华文楷体=STKaiti;华文仿宋=华文仿宋;思源黑体=Source Han Sans CN;思源宋体=Source Han Serif SC;华文细黑=STXihei;黑体=SimHei;方正粗圆简体=方正粗圆简体;Andale Mono=andale mono,times;",
			images_upload_handler: this.handleUpload,
			// image_dimensions: false,
			paste_preprocess(_: any, args: any) {
				args.content = args.content.replace(/(https|http):\/\/mmbiz.qpic.cn\//g, "/");
			},
			...init,
		};

		return (
			<Editor
				value={this.props.value}
				init={defaultInit}
				onEditorChange={this.handleEditorChange}
				// tinymce 目前使用公司内部的oss
				tinymceScriptSrc="https://yzzl-xiaochengxu.oss-cn-shenzhen.aliyuncs.com/yizhentong/devTools/tinymce/tinymce.min.js"
				{...otherProps}
			/>
		);
	}
}

export default CustomEditor;
