import AppLogo from '@components/logo';
import Link from 'next/link';

const FooterSection = () => {
  return (
    <footer className="bg-[#eaf4f8] text-[#35677e] dark:bg-[#102735] dark:text-sky-100/80">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-8 border-b border-[#c7dce5] pb-10 dark:border-white/15 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3]">
              <AppLogo scale={0.9} />
            </Link>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-start gap-x-8 gap-y-4 text-sm font-semibold">
            <Link href="/library" className="hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:hover:text-white">
              Library
            </Link>
            <a href="https://github.com/sparkeduab/sparked-next" className="hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:hover:text-white">
              GitHub
            </a>
          </nav>
        </div>
        <p className="pt-7 text-sm">© {new Date().getFullYear()} SparkEd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterSection;
