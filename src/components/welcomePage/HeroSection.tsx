import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <>
      <section className="bg-sky-50 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row gap-16 md:gap-6 xl:gap-0 md:justify-start px-6 mx-auto max-w-screen-lg  py-16">
          <div className="place-self-center mr-auto md:w-[50%]">
            <h1 className="mb-6 max-w-2xl font-medium leading-none text-sky-900 text-7xl dark:text-white">
              Your digital library
            </h1>
            <h3 className="max-w-2xl font-medium mb-10 text-3xl">Easily manage your organization resources</h3>
            <Link
              href="/library"
              className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 font-semibold rounded-lg px-5 py-3 me-2 mb-2 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
            >
              Get Started
            </Link>
          </div>
          <div className="flex flex-col items-center md:w-[50%] justify-center">
            <Image width={600} height={788} src="/landing-page-feature-image-2.png" alt="Landing page feature image" />
          </div>
        </div>
      </section>

      <section className="bg-sky-100 dark:bg-gray-800">
        <div className="py-8 px-6 mx-auto max-w-screen-lg sm:py-16 lg:px-6">
          <div className="mb-8 max-w-screen-md lg:mb-16">
            <h2 className="mb-4 text-4xl font-semibold text-sky-900 dark:text-white">
              Designed for schools and large organizations
            </h2>
            <p className=" sm:text-xl">
              SparkEd is designed for schools and organizations, SparkEd is designed for schools and organizations.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-sky-200 lg:h-12 lg:w-12 dark:bg-sky-700">
                <svg
                  className="w-5 h-5 text-sky-600 lg:w-6 lg:h-6 dark:text-sky-300"
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
              <h3 className="mb-2 text-xl font-semibold text-sky-900 dark:text-white">Course based</h3>
              <p>Organize contents for colleges with different courses</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-sky-200 lg:h-12 lg:w-12 dark:bg-sky-700">
                <svg
                  className="w-5 h-5 text-sky-600 lg:w-6 lg:h-6 dark:text-sky-300"
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
              <h3 className="mb-2 text-xl font-semibold text-sky-900 dark:text-white">University based</h3>
              <p>Ability to organize contents following the University structure</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-sky-200 lg:h-12 lg:w-12 dark:bg-sky-700">
                <svg
                  className="w-5 h-5 text-sky-600 lg:w-6 lg:h-6 dark:text-sky-300"
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
              <h3 className="mb-2 text-xl font-semibold text-sky-900 dark:text-white">High School based</h3>
              <p>Contents can also be arranged as High Schools to help small schools manage their contents</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
