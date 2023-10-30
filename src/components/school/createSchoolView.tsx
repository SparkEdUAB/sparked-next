/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useSchool from "@hooks/useSchool";
import { Card, Col, Form, Input, Row, Skeleton } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { CREATE_SCHOOL_FORM_FIELDS } from "./constants";
import { AdminPageTitle } from "@components/layouts";
import SchoolStore from "@state/mobx/scholStore";

const onFinishFailed = (errorInfo: any) => {};

const CreateSchoolView: React.FC = () => {
  const { createSchool, fetchSchool, school } = useSchool();

  const { selectedSchool } = SchoolStore;

  const [form] = Form.useForm();

  return (
    <>
      <AdminPageTitle title={i18next.t("create_school")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_school")}</p>}
            bordered={false}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={selectedSchool || {}}
              onFinish={createSchool}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">
                    {CREATE_SCHOOL_FORM_FIELDS.name.label}
                  </p>
                }
                name={CREATE_SCHOOL_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: CREATE_SCHOOL_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input defaultValue={school?.name} />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {CREATE_SCHOOL_FORM_FIELDS.description.label}
                  </p>
                }
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
                <Button
                  className={"form-submit-btn"}
                  type="primary"
                  htmlType="submit"
                >
                  {i18next.t("submit")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateSchoolView;
