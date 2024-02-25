import { Col, Form, Input, Row, Card } from "antd";
import i18next from "i18next";
import { CourseBasedSvgImage } from "@components/svgs";
import { Button } from "flowbite-react";
import { SIGNUP_FORM_FIELDS } from "./constants";
import useAuth from "@hooks/useAuth";

const onFinishFailed = (errorInfo: any) => {};

const Signup: React.FC = () => {
  const { handleSignup } = useAuth();

  return (
    <Row className="auth-container">
      {/* <Col span={12}>
        <CourseBasedSvgImage height={1000} width={1000} className="image-style" />
      </Col> */}

      <Col span={12}>

          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleSignup}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="form-style"
          >
            <Form.Item
              // label={SIGNUP_FORM_FIELDS.email.label}
              name={SIGNUP_FORM_FIELDS.email.key}
              rules={[
                {
                  required: true,
                  message: SIGNUP_FORM_FIELDS.email.errorMsg,
                },
              ]}
              className="form-item-style"
            >
              <Input className="input-style" />
            </Form.Item>

            <Form.Item
              // label={SIGNUP_FORM_FIELDS.password.label}
              name={SIGNUP_FORM_FIELDS.password.key}
              rules={[
                {
                  required: true,
                  message: SIGNUP_FORM_FIELDS.password.errorMsg,
                },
              ]}
              className="form-item-style"
            >
              <Input.Password className="input-style" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="form-item-style">
              <Button type="primary" htmlType="submit" className="button-style">
                {i18next.t("submit")}
              </Button>
            </Form.Item>
          </Form>
      </Col>
    </Row>
  );
};

export default Signup;