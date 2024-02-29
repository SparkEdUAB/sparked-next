'use client';

import React from 'react';
import { Button, Flex } from 'antd';

import Link from 'next/link';

// TODO: divide this page in sections

const WelcomePage: React.FC = () => {
  return (
    <>
      <header>
        <nav className="bg-blue-50 border-blue-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="https://flowbite.com" className="flex items-center">
              <span className="self-center text-xl font-semibold text-blue-900 whitespace-nowrap dark:text-white">
                SparkEd
              </span>
            </a>
            <div className="flex items-center lg:order-2">
              <Flex gap="small" wrap="wrap">
                <Button type="link" className="text-blue-600" size='large'>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button type="text" className="bg-blue-600 text-white" size='large'>
                  <Link href="/auth/signup">Get started</Link>
                </Button>
              </Flex>
            </div>
          </div>
        </nav>
      </header>

      <section className="bg-blue-50 dark:bg-gray-900">
        <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="place-self-center mr-auto lg:col-span-7">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none text-blue-900 md:text-5xl xl:text-6xl dark:text-white">
              Your digital library
            </h1>
            <p className="mb-6 max-w-2xl font-light text-blue-700 lg:mb-8 md:text-lg lg:text-xl dark:text-blue-300">
              Easily manage, your organization resources
            </p>
            <Button size={'large'} className="bg-blue-600 text-white">
              Get Started
            </Button>
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
              SparkEd is designed for schools and organizations, SparkEd is
              designed for schools and organizations.
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
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-white">
                Course based
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Organize contents for colleges with different courses
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
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-white">
                University based
              </h3>
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
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-white">
                High School based
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Contents can also be arranged as High Schools to help small
                schools manage their contents
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 flex justify-center">
          <div className="max-w-screen-lg text-blue-700 sm:text-lg dark:text-blue-300">
            <h2 className="mb-4 text-4xl font-bold text-blue-900 dark:text-white text-center">
              Powering future school digital libraries
            </h2>
            <p className="mb-4 font-light text-center">
              Manage and track educational content across your institution
              through our open, collaborative platform. Link issues across
              different departments and ingest data from various educational
              tools, so your administrative and academic teams have richer
              contextual information to rapidly respond to requests, changes,
              and incidents. This digital approach ensures a seamless management
              of school content.
            </p>

          </div>
        </div>
      </section>

      <footer className="p-4 bg-blue-50 sm:p-6 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="https://flowbite.com" className="flex items-center">
                <span className="self-center text-2xl font-semibold text-blue-900 whitespace-nowrap dark:text-white">
                  SparkEd
                </span>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-blue-900 uppercase dark:text-white">
                  Follow us
                </h2>
                <ul className="text-blue-700 dark:text-blue-300">
                  <li className="mb-4">
                    <a
                      href="https://github.com/sparkeduab/sparked-next"
                      className="hover:underline "
                    >
                      Github
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-blue-900 uppercase dark:text-white">
                  Legal
                </h2>
                <ul className="text-blue-700 dark:text-blue-300">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-blue-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-blue-700 sm:text-center dark:text-blue-300">
              © 2024{' '}
              <a href="" className="hover:underline">
                SparkEd™
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default WelcomePage;
