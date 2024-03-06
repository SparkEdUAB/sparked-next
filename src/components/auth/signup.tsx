import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useAuth from '@hooks/useAuth';
import Link from 'next/link';
import { SIGNUP_FORM_FIELDS } from './constants';

const onFinishFailed = (errorInfo: any) => {};

const Signup = () => {
  const { handleSignup, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <Form name="normal_login" className="mt-8 space-y-6" onFinish={handleSignup} onFinishFailed={onFinishFailed}>
          <Form.Item
            name={SIGNUP_FORM_FIELDS.email.key}
            rules={[
              {
                required: true,
                message: SIGNUP_FORM_FIELDS.email.errorMsg,
              },
            ]}
          >
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: 'white',
              }}
            >
              Sign up
            </Button>
          </Form.Item>
          <div className="flex items-center justify-between">
            <div>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-indigo-500">
                Login
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
