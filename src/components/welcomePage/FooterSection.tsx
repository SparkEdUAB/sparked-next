import AppLogo from '@components/logo';


import Link from 'next/link';

const FooterSection = () => {
  return (
    <>
      <footer className="bg-sky-50 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-lg p-6">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="self-center text-2xl font-semibold text-sky-900 whitespace-nowrap dark:text-white">
                  <AppLogo scale={0.8} />
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-sky-900 uppercase dark:text-white">Follow us</h2>
                <ul className="text-sky-700 dark:text-sky-300">
                  <li className="mb-3">
                    <a href="https://github.com/sparkeduab/sparked-next" className="hover:underline ">
                      Github
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-3 text-sm font-semibold text-sky-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-sky-700 dark:text-sky-300">
                  <li className="mb-3">
                    <a href="#" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-sky-200 md:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="md:flex md:items-center md:justify-center">
            <span className="text-sm text-sky-700 md:text-center dark:text-sky-300">
              © 2025{' '}
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

export default FooterSection;
