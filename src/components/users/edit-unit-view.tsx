/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import useProgram from "@hooks/useProgram";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { USER_FORM_FIELDS } from "./constants";
import useSchool from "@hooks/useSchool";
import useUnit from "@hooks/useUnit";
import useCourse from "@hooks/useCourse";

const EditUnitView: React.FC = () => {
  const [form] = Form.useForm();
  const { editUnit, fetchUnitById, unit } = useUnit(form);
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();

  const searchParams = useSearchParams();


  useEffect(() => {
    fetchUnitById({
      unitId: searchParams.get("unitId") as string,
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
    fetchCourses({});
  }, []);

  return (
    <>
      <AdminPageTitle title={i18next.t("edit_unit")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{unit?.name}</p>}
            bordered={false}
          >
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={unit || {}}
              onFinish={editUnit}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">{USER_FORM_FIELDS.name.label}</p>
                }
                name={USER_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {USER_FORM_FIELDS.description.label}
                  </p>
                }
                name={USER_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: USER_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">{USER_FORM_FIELDS.school.label}</p>
                }
                name={USER_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: USER_FORM_FIELDS.school.errorMsg,
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
                  <p className="form-label">{USER_FORM_FIELDS.program.label}</p>
                }
                name={USER_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: USER_FORM_FIELDS.program.errorMsg,
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
                  <p className="form-label">{USER_FORM_FIELDS.course.label}</p>
                }
                name={USER_FORM_FIELDS.course.key}
                rules={[
                  {
                    message: USER_FORM_FIELDS.course.errorMsg,
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

export default EditUnitView;
