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
import { UNIT_FORM_FIELDS } from "./constants";
import useProgram from "@hooks/useProgram";
import useUnit from "@hooks/useUnit";

const onFinishFailed = (errorInfo: any) => {};

const CreateUnitView: React.FC = () => {
  const { createUnit } = useUnit();
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
      <AdminPageTitle title={i18next.t("create_unit")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_unit")}</p>}
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
                  <p className="form-label">{UNIT_FORM_FIELDS.name.label}</p>
                }
                name={UNIT_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: UNIT_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {UNIT_FORM_FIELDS.description.label}
                  </p>
                }
                name={UNIT_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: UNIT_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">{UNIT_FORM_FIELDS.school.label}</p>
                }
                name={UNIT_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: UNIT_FORM_FIELDS.school.errorMsg,
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
                  <p className="form-label">{UNIT_FORM_FIELDS.program.label}</p>
                }
                name={UNIT_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: UNIT_FORM_FIELDS.program.errorMsg,
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

              <Form.Item
                label={
                  <p className="form-label">{UNIT_FORM_FIELDS.course.label}</p>
                }
                name={UNIT_FORM_FIELDS.course.key}
                rules={[
                  {
                    message: UNIT_FORM_FIELDS.course.errorMsg,
                  },
                ]}
              >
                <Select
                  options={courses.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  className={"form-submit-btn"}
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

export default CreateUnitView;
