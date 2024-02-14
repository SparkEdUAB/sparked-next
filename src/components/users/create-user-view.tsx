/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import useCourse from "@hooks/useCourse";
import useProgram from "@hooks/useProgram";
import useSchool from "@hooks/useSchool";
import useUsers from "@hooks/useUser";
import SchoolStore from "@state/mobx/scholStore";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useEffect } from "react";
import { USER_FORM_FIELDS } from "./constants";
import { Checkbox } from "antd";

const onFinishFailed = (errorInfo: any) => {};

const CreateUserView: React.FC = () => {
  const { createUnit, onEmailPasswordChange } = useUsers();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
    fetchCourses({});
  }, []);

  const [form] = Form.useForm();

  return (
    <>
      <AdminPageTitle title={i18next.t("create_user")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_user")}</p>}
            bordered={false}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={selectedSchool || {}}
              onFinish={createUnit}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">
                    {USER_FORM_FIELDS.first_name.label}
                  </p>
                }
                name={USER_FORM_FIELDS.first_name.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.first_name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {USER_FORM_FIELDS.last_name.label}
                  </p>
                }
                name={USER_FORM_FIELDS.last_name.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.last_name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">{USER_FORM_FIELDS.email.label}</p>
                }
                name={USER_FORM_FIELDS.email.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.email.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {USER_FORM_FIELDS.password.label}
                  </p>
                }
                name={USER_FORM_FIELDS.password.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.password.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {USER_FORM_FIELDS.confirm_password.label}
                  </p>
                }
                name={USER_FORM_FIELDS.confirm_password.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.confirm_password.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">{USER_FORM_FIELDS.gender.label}</p>
                }
                name={USER_FORM_FIELDS.gender.key}
                rules={[
                  {
                    message: USER_FORM_FIELDS.gender.errorMsg,
                  },
                ]}
              >
                <Select
                  options={["male", "female"].map((i) => ({
                    value: i,
                    label: i,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {USER_FORM_FIELDS.email_password.label}
                  </p>
                }
                name={USER_FORM_FIELDS.email_password.key}
                rules={[
                  {
                    required: false,
                    message: USER_FORM_FIELDS.email_password.errorMsg,
                  },
                ]}
              >
                <Checkbox onChange={onEmailPasswordChange} />
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

export default CreateUserView;
