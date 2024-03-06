import { Button, Flex } from 'antd';

import Link from 'next/link';

const HeaderSection = () => {
  return (
    <header>
      <nav className="bg-blue-50 border-blue-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="" className="flex items-center">
            <span className="self-center text-xl font-semibold text-blue-900 whitespace-nowrap dark:text-white">
              SparkEd
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <Flex gap="small" wrap="wrap">
              <Button type="link" className="text-blue-600" size="large">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button type="text" className="bg-blue-600 text-white" size="large">
                <Link href="/auth/signup">Get started</Link>
              </Button>
            </Flex>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
