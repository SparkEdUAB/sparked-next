import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useAuth from '@hooks/useAuth';
import i18next from 'i18next';
import Link from 'next/link'
import { SIGNUP_FORM_FIELDS } from './constants';

const onFinishFailed = (errorInfo: any) => {};

const Signup = () => {
  const { handleSignup, loading } = useAuth();

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
        onFinish={handleSignup}
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
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder={SIGNUP_FORM_FIELDS.email.label}
            width={300}
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
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={SIGNUP_FORM_FIELDS.password.label}
            size="large"
          />
        </Form.Item>
        <Form.Item className="form-item-style">
          <Button
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
            {i18next.t('submit')}
          </Button>
          <span style={{ marginLeft: '10px' }}>Or</span>
          <Link href="/auth/login" style={{ marginLeft: '10px' }}>Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
