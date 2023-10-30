/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import useProgram from "@hooks/useProgram";
import useSchool from "@hooks/useSchool";
import SchoolStore from "@state/mobx/scholStore";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useEffect } from "react";
import { CREATE_PROGRAM_FORM_FIELDS } from "./constants";

const onFinishFailed = (errorInfo: any) => {};

const CreateProgramView: React.FC = () => {
  const { createProgram } = useProgram();
  const { fetchSchools, schools } = useSchool();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
  }, []);

  const [form] = Form.useForm();

  return (
    <>
      <AdminPageTitle title={i18next.t("create_program")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_program")}</p>}
            bordered={false}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={selectedSchool || {}}
              onFinish={createProgram}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">
                    {CREATE_PROGRAM_FORM_FIELDS.name.label}
                  </p>
                }
                name={CREATE_PROGRAM_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: CREATE_PROGRAM_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {CREATE_PROGRAM_FORM_FIELDS.description.label}
                  </p>
                }
                name={CREATE_PROGRAM_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: CREATE_PROGRAM_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {CREATE_PROGRAM_FORM_FIELDS.school.label}
                  </p>
                }
                name={CREATE_PROGRAM_FORM_FIELDS.school.key}
                rules={[
                  {
                    required: true,
                    message: CREATE_PROGRAM_FORM_FIELDS.school.errorMsg,
                  },
                ]}
              >
                <Select
                  // onChange={handleChange}
                  options={schools.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
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

export default CreateProgramView;
