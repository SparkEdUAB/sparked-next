/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import useCourse from "@hooks/useCourse";
import useSchool from "@hooks/useSchool";
import SchoolStore from "@state/mobx/scholStore";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useEffect } from "react";
import { COURSE_FORM_FIELDS } from "./constants";
import useProgram from "@hooks/useProgram";

const onFinishFailed = (errorInfo: any) => {};

const CreateCourseView: React.FC = () => {
  const { createCourse } = useCourse();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
  }, []);

  const [form] = Form.useForm();

  return (
    <>
      <AdminPageTitle title={i18next.t("create_course")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_course")}</p>}
            bordered={false}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={selectedSchool || {}}
              onFinish={createCourse}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">{COURSE_FORM_FIELDS.name.label}</p>
                }
                name={COURSE_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: COURSE_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {COURSE_FORM_FIELDS.description.label}
                  </p>
                }
                name={COURSE_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: COURSE_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {COURSE_FORM_FIELDS.school.label}
                  </p>
                }
                name={COURSE_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: COURSE_FORM_FIELDS.school.errorMsg,
                  },
                ]}
              >
                <Select
                  options={schools.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label={
                  <p className="form-label">
                    {COURSE_FORM_FIELDS.program.label}
                  </p>
                }
                name={COURSE_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: COURSE_FORM_FIELDS.program.errorMsg,
                  },
                ]}
              >
                <Select
                  options={programs.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  className={"form-submit-btn"}
                  //  @ts-ignore
                  type="submit"
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

export default CreateCourseView;
