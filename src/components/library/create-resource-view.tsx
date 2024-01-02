/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import UploadView from "@components/molecue/upload-view";
import useMediaContent from "@hooks/use-media-content";
import useTopic from "@hooks/use-topic";
import useCourse from "@hooks/useCourse";
import useProgram from "@hooks/useProgram";
import useSchool from "@hooks/useSchool";
import useUnit from "@hooks/useUnit";
import SchoolStore from "@state/mobx/scholStore";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useEffect } from "react";
import { RESOURCE_FORM_FIELDS } from "./constants";

const CreateResourceView: React.FC = () => {
  const { createResource } = useMediaContent();

  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();
  const { fetchUnits, units } = useUnit();
  const { fetchTopics, topics } = useTopic();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
    fetchCourses({});
    fetchUnits({});
    fetchTopics({});
  }, []);

  const [form] = Form.useForm();

  return (
    <>
      <AdminPageTitle title={i18next.t("create_resource")} />

      <Row className="form-container">
        <Col span={12}>
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
              onFinish={createResource}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">
                    {RESOURCE_FORM_FIELDS.name.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: RESOURCE_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {RESOURCE_FORM_FIELDS.description.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: RESOURCE_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {RESOURCE_FORM_FIELDS.school.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: RESOURCE_FORM_FIELDS.school.errorMsg,
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
                    {RESOURCE_FORM_FIELDS.program.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: RESOURCE_FORM_FIELDS.program.errorMsg,
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
                  <p className="form-label">
                    {RESOURCE_FORM_FIELDS.course.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.course.key}
                rules={[
                  {
                    message: RESOURCE_FORM_FIELDS.course.errorMsg,
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
                  <p className="form-label">
                    {RESOURCE_FORM_FIELDS.unit.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.unit.key}
                rules={[
                  {
                    message: RESOURCE_FORM_FIELDS.unit.errorMsg,
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

              <Form.Item
                label={
                  <p className="form-label">
                    {RESOURCE_FORM_FIELDS.topic.label}
                  </p>
                }
                name={RESOURCE_FORM_FIELDS.topic.key}
                rules={[
                  {
                    message: RESOURCE_FORM_FIELDS.topic.errorMsg,
                  },
                ]}
              >
                <Select
                  options={topics.map((i) => ({
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

        <Col span={12}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("upload_media")}</p>}
            bordered={false}
          >
            <UploadView />
          </Card>
          <Card
            style={{ minHeight: 265 }}
            className="form-card"
            title={<p className="form-label">{i18next.t("preview")}</p>}
            bordered={false}
          ></Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateResourceView;
