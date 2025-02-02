"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FaBookOpen,
  FaUsers,
  FaGraduationCap,
  FaClock
} from 'react-icons/fa';

const HeroSection = () => {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    '/hero1.jpg',
    '/hero2.jpg',
    '/hero3.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="bg-sky-50 dark:bg-gray-900">
        <div className="relative min-h-[600px] flex items-center">
          {backgroundImages.map((image, index) => (
            <div
              key={image}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: currentImageIndex === index ? 1 : 0,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}

          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="relative w-full px-6 mx-auto max-w-screen-lg"> {/* Removed py-16 and added w-full */}
            <div className="place-self-center mr-auto md:w-[60%]">
              <h1 className="mb-6 max-w-2xl font-medium leading-none text-white text-7xl">
                Your digital library
              </h1>
              <h3 className="max-w-2xl font-medium mb-10 text-3xl text-white">
                Easily manage your school educational materials
              </h3>
              <Link
                prefetch
                href="/library"
                className="inline-block text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 font-semibold rounded-lg px-5 py-3 me-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-screen-lg sm:py-16 lg:px-6">
          <div className="mb-8 max-w-screen-md lg:mb-16 mx-auto text-center">
            <h2 className="mb-4 text-4xl font-bold text-sky-900 dark:text-white lg:text-4xl">
              Designed for modern schools
            </h2>
            <p className="sm:text-xl">
              SparkEd is a digital library created for schools, offering a platform where educators can easily upload learning materials and students can access them anytime, anywhere. With SparkEd, users can read books, watch educational videos, making learning more flexible and accessible for everyone.
            </p>
          </div>
        </div>
        {/* Hero Title Area */}
        <div className="pt-2 pb-8 px-4 mx-auto max-w-screen-xl text-center pt-1">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-sky-900 dark:text-white lg:text-4xl">
            Your School&apos;s Digital Future
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your educational institution with a modern digital library that brings together students, educators, and resources in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="px-4 mx-auto max-w-screen-xl lg:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-16 justify-items-center max-w-4xl mx-auto">
            {/* Digital Content Hub */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300 text-center">
              <div className="flex justify-center items-center w-12 h-12 mb-4 bg-sky-100 rounded-lg dark:bg-sky-900 mx-auto">
                <FaBookOpen className="w-6 h-6 text-sky-600 dark:text-sky-300" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 dark:text-white mb-3">Digital Content Hub</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access textbooks, and educational materials anytime, anywhere. Support for multiple formats including PDFs, videos, and interactive content.
              </p>
            </div>

            {/* Collaborative Learning */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300 text-center">
              <div className="flex justify-center items-center w-12 h-12 mb-4 bg-sky-100 rounded-lg dark:bg-sky-900 mx-auto">
                <FaUsers className="w-6 h-6 text-sky-600 dark:text-sky-300" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 dark:text-white mb-3">Collaborative Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Foster collaboration between students and teachers with shared resources, discussion boards, and group study materials.
              </p>
            </div>

            {/* Course Management */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300 text-center">
              <div className="flex justify-center items-center w-12 h-12 mb-4 bg-sky-100 rounded-lg dark:bg-sky-900 mx-auto">
                <FaGraduationCap className="w-6 h-6 text-sky-600 dark:text-sky-300" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 dark:text-white mb-3">Course Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize content by subjects, topics or grade levels for different educational needs.
              </p>
            </div>

            {/* 24/7 Access */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300 text-center">
              <div className="flex justify-center items-center w-12 h-12 mb-4 bg-sky-100 rounded-lg dark:bg-sky-900 mx-auto">
                <FaClock className="w-6 h-6 text-sky-600 dark:text-sky-300" />
              </div>
              <h3 className="text-xl font-bold text-sky-900 dark:text-white mb-3">24/7 Access</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Provide round-the-clock access to educational resources. Support remote learning and flexible study schedules.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
