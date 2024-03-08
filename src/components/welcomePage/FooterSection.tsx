const FooterSection = () => {
  return (
    <>
      <section className="bg-blue-50 dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-lg lg:py-16 lg:px-6 flex justify-center">
          <div className="max-w-screen-xl text-blue-700 sm:text-lg dark:text-blue-300">
            <h2 className="mb-4 text-4xl font-bold text-blue-900 dark:text-white text-center">
              Powering future school digital libraries
            </h2>
            <p className="mb-4 font-light text-center">
              Manage and track educational content across your institution through our open, collaborative platform.
              Link issues across different departments and ingest data from various educational tools, so your
              administrative and academic teams have richer contextual information to rapidly respond to requests,
              changes, and incidents. This digital approach ensures a seamless management of school content.
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
                <h2 className="mb-6 text-sm font-semibold text-blue-900 uppercase dark:text-white">Follow us</h2>
                <ul className="text-blue-700 dark:text-blue-300">
                  <li className="mb-4">
                    <a href="https://github.com/sparkeduab/sparked-next" className="hover:underline ">
                      Github
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-blue-900 uppercase dark:text-white">Legal</h2>
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

export default FooterSection;
