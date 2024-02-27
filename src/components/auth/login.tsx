import {  Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined,  } from '@ant-design/icons';
// @todo use login form fields
import { SIGNUP_FORM_FIELDS } from "./constants";
import useAuth from "@hooks/useAuth";
import Link from "next/link";

const onFinishFailed = (errorInfo: any) => {};

const Login: React.FC = () => {
  const { handleLogin, loading } = useAuth();

  return (
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Form
      name="normal_login"
      className="login-form"
      onFinish={handleLogin}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name={SIGNUP_FORM_FIELDS.email.key}
        rules={[
          {
            required: true,
            message: SIGNUP_FORM_FIELDS.email.errorMsg,
          },
        ]}
        style={{ width: '400px' }}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={SIGNUP_FORM_FIELDS.email.label}
        />
      </Form.Item>
      <Form.Item
        name={SIGNUP_FORM_FIELDS.password.key}
        rules={[
          {
            required: true,
            message: SIGNUP_FORM_FIELDS.password.errorMsg,
          },
        ]}
        style={{ width: '400px' }}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={SIGNUP_FORM_FIELDS.password.label}
          size="large"
        />
      </Form.Item>
      <Form.Item className="form-item-style">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
          //@ts-ignore
            type="primary"
            htmlType="submit"
            className="button-style"
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              color: 'white',
            }}
            loading={loading}
          >
           Login
          </Button>
          <span style={{ marginLeft: '10px' }}>Or</span>
          <Link href="/auth/signup" style={{ marginLeft: '10px' }}>Register</Link>
        </div>
      </Form.Item>
    </Form>
  </div>
  );
};

export default Login;