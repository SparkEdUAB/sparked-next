import {
  LaptopOutlined,
  NotificationOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import React, { ReactNode } from "react";

import { Input } from 'antd';
import ContentTags from "./content-tags";
import { bookTitles } from "./book-titles";

const { Search } = Input;


type T_props = {
  children:ReactNode;
};


const { Header, Content, Sider } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
 {icon: UserOutlined,title:'Trending'},
 { icon:LaptopOutlined,title:'Recommended'},
  {icon:NotificationOutlined,title:'Favorite'},
].map((i, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(i.icon),
    label: i.title,

    children: bookTitles.slice(0,6).map((i, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: i,
      };
    }),
  };
});



const LibraryLayout: React.FC<T_props> = (props) => {

  const {children} = props;


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Input
          size="small"
          addonBefore={<SearchOutlined />}
          placeholder="Search content"
        />

        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[...items1]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <ContentTags />

      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Library</Breadcrumb.Item>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LibraryLayout;
