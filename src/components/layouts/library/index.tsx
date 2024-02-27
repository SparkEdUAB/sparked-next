"use client";

import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Form, Layout, Menu, Select, theme } from "antd";
import React, { ReactNode, useEffect } from "react";

import useCourse from "@hooks/useCourse";
import useProgram from "@hooks/useProgram";
import useSchool from "@hooks/useSchool";
import { Input } from "antd";
import { bookTitles } from "./book-titles";
import ContentTags from "./content-tags";


type T_props = {
  children: ReactNode;
};

const { Header, Content, Sider } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  { icon: UserOutlined, title: "Trending" },
  { icon: LaptopOutlined, title: "Recommended" },
  { icon: NotificationOutlined, title: "Favorite" },
].map((i, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(i.icon),
    label: i.title,

    children: bookTitles.slice(0, 6).map((i, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: i,
      };
    }),
  };
});

const LibraryLayout: React.FC<T_props> = (props) => {
  const { children } = props;

  const [form] = Form.useForm();

  const { courses } = useCourse();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Form
        form={form}
        layout="inline"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: "100%",
          margin: 10,
          borderBottom: "10px white dotted",
        }}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
        <Form.Item name={"search"} rules={[{}]}>
          <Input
            style={{
              borderRadius: "10px",
              width: 150,
              marginTop: -5,
              height: 30,
            }}
            size="small"
            placeholder="Search content"
          />
        </Form.Item>
        <Form.Item
          label={
            <p className="content-form-label" style={{ margin: 0 }}>
              School
            </p>
          }
          name={"school"}
          rules={[{}]}
        >
          <Select
            className="content-drop-down-filter"
            options={schools.map((i) => ({
              value: i._id,
              label: i.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          // style={{ maxWidth: 300 }}
          label={
            <p className="content-form-label" style={{ margin: 0 }}>
              Programs
            </p>
          }
          name={"Programs"}
          rules={[{}]}
        >
          <Select
            className="content-drop-down-filter"
            options={programs.map((i) => ({
              value: i._id,
              label: i.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={
            <p className="content-form-label" style={{ margin: 0 }}>
              Courses
            </p>
          }
          name={"Courses"}
          rules={[{}]}
        >
          <Select
            className="content-drop-down-filter"
            options={programs.map((i) => ({
              value: i._id,
              label: i.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={
            <p className="content-form-label" style={{ margin: 0 }}>
              Unit
            </p>
          }
          name={"unit"}
          rules={[{}]}
        >
          <Select
            className="content-drop-down-filter"
            options={programs.map((i) => ({
              value: i._id,
              label: i.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          label={
            <p className="content-form-label" style={{ margin: 0 }}>
              Topics
            </p>
          }
          name={"Topics"}
          rules={[{}]}
        >
          <Select
            className="content-drop-down-filter"
            options={programs.map((i) => ({
              value: i._id,
              label: i.name,
            }))}
          />
        </Form.Item>
      </Form>
      {/* </Row> */}

      <ContentTags />

      <Layout hasSider>
        <Sider
          width={200}
          style={{
            overflow: "auto",
            height: "100vh",

            position: "fixed",
            left: 0,
            top: 280,
            bottom: 0,
            background: colorBgContainer,
          }}
          // style={{ background: colorBgContainer }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Library</Breadcrumb.Item>
            <Breadcrumb.Item>Content</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              maxHeight:600,
              position:'fixed',
              overflow:'scroll',
              // background: colorBgContainer,
              borderRadius: borderRadiusLG,
              marginLeft:200,
              // marginTop:30
            }}
            // style={{ margin: "24px 16px 0", overflow: "initial" }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LibraryLayout;
