import { Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TschoolTableView } from "./types";

export const schoolTableColumns: ColumnsType<TschoolTableView> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },

  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Delete</a>
      </Space>
    ),
  },
];
