import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { SIGNUP_FORM_FIELDS } from './constants';
import useAuth from '@hooks/useAuth';
import Link from 'next/link';

const onFinishFailed = (errorInfo: any) => {};

const Login: React.FC = () => {
  const { handleLogin, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <Form name="normal_login" className="mt-8 space-y-6" onFinish={handleLogin} onFinishFailed={onFinishFailed}>
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
              Sign in
            </Button>
          </Form.Item>
          <div className="flex items-center justify-between">
            <div>
              Don&#39;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-indigo-500">
                Register
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
