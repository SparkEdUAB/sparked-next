import { Button, Flex } from 'antd';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <>
      <section className="bg-blue-50 dark:bg-gray-900">
        <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="place-self-center mr-auto lg:col-span-7">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none text-blue-900 md:text-5xl xl:text-6xl dark:text-white">
              Your digital library
            </h1>
            <p className="mb-6 max-w-2xl font-light text-blue-700 lg:mb-8 md:text-lg lg:text-xl dark:text-blue-300">
              Easily manage your organization resources
            </p>
            <Link
              href="/library"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-100 dark:bg-gray-800">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="mb-8 max-w-screen-md lg:mb-16">
            <h2 className="mb-4 text-4xl font-extrabold text-blue-900 dark:text-white">
              Designed for schools and large organizations
            </h2>
            <p className="text-blue-700 sm:text-xl dark:text-blue-300">
              SparkEd is designed for schools and organizations, SparkEd is designed for schools and organizations.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-200 lg:h-12 lg:w-12 dark:bg-blue-700">
                <svg
                  className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-white">Course based</h3>
              <p className="text-blue-700 dark:text-blue-300">Organize contents for colleges with different courses</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-200 lg:h-12 lg:w-12 dark:bg-blue-700">
                <svg
                  className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-white">University based</h3>
              <p className="text-blue-700 dark:text-blue-300">
                Ability to organize contents following the University structure
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-200 lg:h-12 lg:w-12 dark:bg-blue-700">
                <svg
                  className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-white">High School based</h3>
              <p className="text-blue-700 dark:text-blue-300">
                Contents can also be arranged as High Schools to help small schools manage their contents
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
