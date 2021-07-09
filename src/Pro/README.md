
## Pro组件介绍

## columns

 ### 示例：
```javascript
// 构建系列组件通用配置
const [columns, setColumns] = useState<any[]>([
  {
    title: "名称",
    dataIndex: "functionName",
    width: "25%",
    search: true,
    table: true,
    action: true,
    detail: (record: TableData) => {
      return record.functionName + "-测试下哈";
    },
  },
  {
    title: "编码",
    dataIndex: "functionCode",
    width: "25%",
    // 自定义搜索栏表单项
    search: (hidden: boolean) => {
      return (
        <Form.Item key="functionCode" hidden={hidden} label="编码" name="functionCode">
					<Input placeholder="请输入编码" allowClear />
				</Form.Item>
      );
    },
    table: true,
    // 自定义新增/编辑表单项
    action: () => {
      return (
        <Form.Item key="functionCode" label="编码" name="functionCode">
					<Input placeholder="请输入编码" allowClear />
				</Form.Item>
      );
    },
    detail: true,
  },
  {
    title: "归属小镇",
    dataIndex: "town",
    width: "20%",
    action: true,
    valueType: "select",
    options: ...    // antd select 的值类型
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "15%",
    search: true,
    table: true,
    detail: true,
    valueType: "enum",
    valueEnum: {
      1: { text: "启用", status: "success" },
      2: { text: "禁用", status: "error" },
    },
  },
  {
    title: "政策正文",
    dataIndex: "content",
    action: true,
    valueType: "editor",
    formItemProps: {
      validateTrigger: "onBlur",
      className: "editor-wrap",
      wrapperCol: { span: 20 },
    },
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    width: "20%",
    table: true,
    valueType: "dateRange",
    typeProps: {
      ...
    }
  },
  ...
  {
    title: "操作",
    dataIndex: "action",
    width: 124,
    render: (v: null, record: TableData) => {
      ...
    },
  },
]);
```
  #### 说明：
  1. title、dataIndex、width等三个antd table基本变量，为必传项，其余皆为选传项，dataIndex设置为"action"时，组件生成表单时会自动过滤掉，不为"action"时则需要手动设置是否过滤；
  2. search: true、table: true、action: true、detail: true等四个变量分别为列表搜索表单、列表显示表格、新增/修改表单是否需要的显示项；
  3. valueType变量是生成表单时需要生成的类型值（默认值："text"），目前的值包括："text"、"select"、"enum"、"editor"、"dataTime"、"dateRange"等（后续会根据需要扩展）
  4. 当值为"enum"枚举类型时，需要传valueEnum变量来描述具体值，valueEnum的格式如下：
  ```javascript
    {
      1: { text: "启用", status: "success" },
      2: { text: "禁用", status: "error" },
      "one": { text: "启用", color: "#87d068" },
      "two": { text: "禁用", color: "#f50" },
    }
    // status、color二者选其一，status值范围: "success" ,"error", "default", "processing", "warning"
  ```
  5. 当值为"select"下拉框类型时，需要传options值，antd select组件的值类型
  6. formItemProps变量为生成表单项外层item的额外属性，支持antd form组件相应的参数
  7. typeProps变量为生成具体表单项的额外属性，详情参照对应类型组件的参数
  8. search（search(hidden)一般用来自定义表单项，hidden当搜索项超过2个以上设置Form.Item属性）、action（action()一般用来自定义表单项、或有关联关系）、detail（detail(data)显示自定义内容，data为详情数据）不为true而是一个函数则具体项为回调函数的返回值

  #### 注意：columns需要动态改变要使用state状态生成，不需要时写成简单变量即可。

## table：

示例：
```javascript
import Table, { TableActionProps } from "@/components/Pro/table";

const tableRef = useRef<TableActionProps>();

<Table
  // 是否需要多选
  checkbox
  // 组件暴露的实例对象索引，用来调用组件方法
  ref={tableRef}
  // 表格列配置，跟系列其他组件复用同一个
  columns={columns}
  // 表格api请求
  request={api}
  // 搜索栏跟表格之间的工具栏，通常实现新增、批量等操作
  action={
    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => onModalShow("add")}>
      新增
    </Button>
  }
/>
// 其他参数说明：

// type Props<T> = {
// 	columns: ColumnsType<T>;
// 	request: (reqs: any) => Promise<Res>;
//  表格显示参数处理
// 	parseData?: (data: T[], page?: Page) => Promise<T[]> | T[];
//  api 请求其他参数
// 	listParams?: any;
//  监听页面改变
// 	onChange?: (page: number, pageSize: number) => void;
//  不分页
// 	noPagination?: boolean;
// 	action?: JSX.Element | JSX.Element[];
// 	checkbox?: boolean;
//  搜索前处理参数
// 	beforeSearchSubmit?: (v: any) => any;
// };

// 暴露的实例方法：

// 刷新
// reload: (isCurrentPage?: boolean, callback?: (res: any) => void) => void;
// 刷新并清空,页码也会重置，包括表单
// reloadAndRest: () => void;
// 获取当前表格数据
// getData: () => any;
// 表格loading
// setLoading: (b: boolean) => void;
// 设置checkbox
// setSelecteds: (selectedRowKeys: number[]) => void;
// 获取所有选中项
// getSelecteds: () => void;
```


## action
示例：

```javascript
import Action, { ProActionProps } from "@/components/Pro/action";

const modalRef = useRef<ProActionProps>();

<Action
  // 组件暴露的实例对象索引，用来调用组件方法
  ref={modalRef}
  // 表格列配置，跟系列其他组件复用同一个
  config={columns}
/>

// 其他参数说明：

// type Props<T> = {
// 	config: ColumnsType<T>;
//  表格布局跟 antd form的布局参数一样
// 	layout?: {
// 		labelCol?: ColProps;
// 		wrapperCol?: ColProps;
// 	};
// };

// 暴露的实例方法：

// 表单校验
// validateFields: (nameList?: NamePath[]) => Promise<any>;
// 获取表单的值
// getFieldsValue: (
//   nameList?: NamePath[],
//   filterFunc?: (meta: { touched: boolean; validating: boolean }) => boolean
// ) => Promise<any>;
// 设置表单的值
// setFieldsValue: (v: any) => void;
// 重置表单的值
// resetFields: () => void;
```

## detail
示例：

```javascript
import Detail from "@/components/Pro/detail";

<Detail
  // 详情请求回来的数据
  data={data}
  // 表格列配置，跟系列其他组件复用同一个
  config={columns}
/>
```
