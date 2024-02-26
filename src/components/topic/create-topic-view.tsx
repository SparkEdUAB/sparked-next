/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import useCourse from "@hooks/useCourse";
import useProgram from "@hooks/useProgram";
import useSchool from "@hooks/useSchool";
import useTopic from "@hooks/use-topic";
import SchoolStore from "@state/mobx/scholStore";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useEffect } from "react";
import { TOPIC_FORM_FIELDS } from "./constants";
import useUnit from "@hooks/useUnit";


const CreateTopicView: React.FC = () => {
  const { createTopic } = useTopic();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();
  const { fetchUnits,units } = useUnit();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
    fetchCourses({});
    fetchUnits({});
  }, []);

  const [form] = Form.useForm();

  return (
    <>
      <AdminPageTitle title={i18next.t("create_topic")} />

      <Row className="form-container">
        <Col span={24}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_topic")}</p>}
            bordered={false}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={selectedSchool || {}}
              onFinish={createTopic}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">{TOPIC_FORM_FIELDS.name.label}</p>
                }
                name={TOPIC_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: TOPIC_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {TOPIC_FORM_FIELDS.description.label}
                  </p>
                }
                name={TOPIC_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: TOPIC_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">{TOPIC_FORM_FIELDS.school.label}</p>
                }
                name={TOPIC_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: TOPIC_FORM_FIELDS.school.errorMsg,
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
                    {TOPIC_FORM_FIELDS.program.label}
                  </p>
                }
                name={TOPIC_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: TOPIC_FORM_FIELDS.program.errorMsg,
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
                  <p className="form-label">{TOPIC_FORM_FIELDS.course.label}</p>
                }
                name={TOPIC_FORM_FIELDS.course.key}
                rules={[
                  {
                    message: TOPIC_FORM_FIELDS.course.errorMsg,
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

              <Form.Item
                label={
                  <p className="form-label">{TOPIC_FORM_FIELDS.unit.label}</p>
                }
                name={TOPIC_FORM_FIELDS.unit.key}
                rules={[
                  {
                    message: TOPIC_FORM_FIELDS.unit.errorMsg,
                  },
                ]}
              >
                <Select
                  options={units.map((i) => ({
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

export default CreateTopicView;
