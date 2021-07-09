import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Pro } from '../.';
import "antd/dist/antd.css"

const App = () => {
  return (
    <div>
      <Pro.table
        request={async () => {
          return {
            code: 200,
            data: [
              {
                num: 1,
                name: "张三"
              },
              {
                num: 2,
                name: "李四"
              }
            ]
          };
        }}
        columns={[
          {
            title: "序号",
            dataIndex: "num",
            table: true,
          },
          {
            title: "姓名",
            dataIndex: "name",
            search: true,
            table: true,
          },
        ]} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
