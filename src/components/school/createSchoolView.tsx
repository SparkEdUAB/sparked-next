"use client";

import useSchool from "@hooks/useSchool";
import { Card, Col, Form, Input, Row } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { CREATE_SCHOOL_FORM_FIELDS } from "./constants";

const onFinishFailed = (errorInfo: any) => {};

const CreateSchoolView: React.FC = () => {
  const { createSchool } = useSchool();

  return (
    <Row className="auth-container">
      <Col span={24}>
        <Card
          className="auth-card"
          title={i18next.t("create_school")}
          bordered={false}
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={createSchool}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={CREATE_SCHOOL_FORM_FIELDS.name.label}
              name={CREATE_SCHOOL_FORM_FIELDS.name.key}
              rules={[
                {
                  required: true,
                  message: CREATE_SCHOOL_FORM_FIELDS.name.errorMsg,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={CREATE_SCHOOL_FORM_FIELDS.description.label}
              name={CREATE_SCHOOL_FORM_FIELDS.description.key}
              rules={[
                {
                  required: true,
                  message: CREATE_SCHOOL_FORM_FIELDS.description.errorMsg,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {i18next.t("submit")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateSchoolView;
