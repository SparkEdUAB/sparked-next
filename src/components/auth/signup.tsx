import { Col, Form, Input, Row } from "antd";
import i18next from "i18next";
import { CourseBasedSvgImage } from "@components/svgs";
import { Card } from "antd";
import { Button } from "flowbite-react";
import { SIGNUP_FORM_FIELDS } from "./constants";
import useAuth from "@hooks/useAuth";

const onFinishFailed = (errorInfo: any) => {};

const Signup: React.FC = () => {
  const { handleSignup } = useAuth();

  return (
    <Row className="auth-container">
      <Col span={12}>
        <CourseBasedSvgImage height={1000} width={1000} />
      </Col>

      <Col span={12}>
        <Card
          className="auth-card"
          title={i18next.t('signp')}
          bordered={false}
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleSignup}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={SIGNUP_FORM_FIELDS.email.label}
              name={SIGNUP_FORM_FIELDS.email.key}
              rules={[
                {
                  required: true,
                  message: SIGNUP_FORM_FIELDS.email.errorMsg,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={SIGNUP_FORM_FIELDS.password.label}
              name={SIGNUP_FORM_FIELDS.password.key}
              rules={[
                {
                  required: true,
                  message: SIGNUP_FORM_FIELDS.password.errorMsg,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {i18next.t('submit')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Signup;
