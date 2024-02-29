/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import useProgram from "@hooks/useProgram";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { COURSE_FORM_FIELDS } from "./constants";
import useSchool from "@hooks/useSchool";
import useCourse from "@hooks/useCourse";

const EditCourseView: React.FC = () => {
  const [form] = Form.useForm();
  const { editCourse, fetchCourseById, course } = useCourse(form);
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();

  const searchParams = useSearchParams();


  useEffect(() => {
    fetchCourseById({
      courseId: searchParams.get("courseId") as string,
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
  }, []);

  return (
    <>
      <AdminPageTitle title={i18next.t("edit_course")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{course?.name}</p>}
            bordered={false}
          >
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={course || {}}
              onFinish={editCourse}
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

export default EditCourseView;
