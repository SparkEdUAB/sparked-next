/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AdminPageTitle } from "@components/layouts";
import UploadView from "@components/molecue/upload-view";
import useMediaContent from "@hooks/use-media-content";
import useCourse from "@hooks/useCourse";
import useProgram from "@hooks/useProgram";
import useSchool from "@hooks/useSchool";
import useUnit from "@hooks/useUnit";
import FileUploadStore from "@state/mobx/fileUploadStore";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MEDIA_CONTENT_FORM_FIELDS } from "./constants";
import MediaContentStore from "@state/mobx/mediaContentStore";
import useTopic from "@hooks/use-topic";

const EditMediaContentView: React.FC = () => {
  const [form] = Form.useForm();

  const { fileUrl } = FileUploadStore;
  const { selectedMediaContent } = MediaContentStore;


  const { editTopic, fetchMediaContentById, targetMediaContent } = useMediaContent(form);
  const {  topics,fetchTopics } = useTopic();
  const { units, fetchUnits } = useUnit();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchMediaContentById({
      mediaContentId: searchParams.get("mediaContentId") as string,
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
    fetchCourses({});
    fetchUnits({});
    fetchTopics({});
  }, []);

  return (
    <>
      <AdminPageTitle title={i18next.t("edit_topic")} />

      <Row className="form-container">
        <Col span={12}>
          <Card
            className="form-card"
            title={<p className="form-label">{i18next.t("new_topic")}</p>}
            bordered={false}
          >
            <Form
            form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={targetMediaContent || {}}
              onFinish={editTopic}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label={
                  <p className="form-label">
                    {MEDIA_CONTENT_FORM_FIELDS.name.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.name.key}
                rules={[
                  {
                    required: true,
                    message: MEDIA_CONTENT_FORM_FIELDS.name.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {MEDIA_CONTENT_FORM_FIELDS.description.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.description.key}
                rules={[
                  {
                    required: true,
                    message: MEDIA_CONTENT_FORM_FIELDS.description.errorMsg,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <p className="form-label">
                    {MEDIA_CONTENT_FORM_FIELDS.school.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.school.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.school.errorMsg,
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
                    {MEDIA_CONTENT_FORM_FIELDS.program.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.program.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.program.errorMsg,
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
                    {MEDIA_CONTENT_FORM_FIELDS.course.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.course.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.course.errorMsg,
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
                    {MEDIA_CONTENT_FORM_FIELDS.unit.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.unit.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.unit.errorMsg,
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
                    {MEDIA_CONTENT_FORM_FIELDS.topic.label}
                  </p>
                }
                name={MEDIA_CONTENT_FORM_FIELDS.topic.key}
                rules={[
                  {
                    message: MEDIA_CONTENT_FORM_FIELDS.topic.errorMsg,
                  },
                ]}
              >
                <Select
                  options={topics?.map((i) => ({
                    value: i._id,
                    label: i.name,
                  }))}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  disabled={!fileUrl}
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

export default EditMediaContentView;
