'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const HeroSection = () => {
  const { status } = useSession();
  const libraryHref = status === 'authenticated' ? '/library' : '/auth/login';

  return (
    <main>
      <section className="bg-[#eaf4f8] dark:bg-[#102735]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-10 lg:py-20">
          <div className="max-w-xl">
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-[#173f59] dark:text-white sm:text-6xl lg:text-[4.4rem]">
              A library for the whole school.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#42687c] dark:text-sky-100/80 sm:text-xl">
              Keep books, videos, and lessons together. Teachers can share what they need, and students can find it whenever they are ready to learn.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href={libraryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#287fa3] px-6 font-semibold text-white transition-colors hover:bg-[#1e6888] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3]"
              >
                Get started
              </Link>
              <a
                href="#why-sparked"
                className="font-semibold text-[#236f91] underline decoration-[#8bb9cb] underline-offset-4 hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:text-sky-200"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-[#b9dce8]">
            <Image
              src="/hero3.jpg"
              alt="Students learning together with tablets in a classroom"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section id="why-sparked" className="bg-white py-20 dark:bg-gray-900 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-[#173f59] dark:text-white sm:text-5xl">
                Make good resources easier to find.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                SparkEd gives learning materials a clear place in your school, so they stay useful beyond a single lesson.
              </p>
            </div>
            <div className="border-t border-[#c7dce5] dark:border-gray-700">
              <div className="grid gap-3 border-b border-[#c7dce5] py-6 dark:border-gray-700 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <h3 className="text-lg font-semibold text-[#176782] dark:text-sky-200">Keep things organized</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">Browse resources by grade, subject, unit, and topic.</p>
              </div>
              <div className="grid gap-3 border-b border-[#c7dce5] py-6 dark:border-gray-700 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <h3 className="text-lg font-semibold text-[#176782] dark:text-sky-200">Use different formats</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">Bring PDFs, videos, and web resources into the same library.</p>
              </div>
              <div className="grid gap-3 border-b border-[#c7dce5] py-6 dark:border-gray-700 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <h3 className="text-lg font-semibold text-[#176782] dark:text-sky-200">Learn beyond class</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">Students can return to the materials they need from wherever they study.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="for-schools" className="bg-[#f1f7f9] py-20 dark:bg-[#162f3e] sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-[#c7dce5]">
            <Image
              src="/hero2.jpg"
              alt="Students with tablets and books during a classroom lesson"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="max-w-lg">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-[#173f59] dark:text-white sm:text-5xl">
              Made for the way schools teach.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Teachers can put a lesson in students&apos; hands without sending files from one place to another. One organized library makes it easier to pick up where class left off.
            </p>
            <Link
              href={libraryHref}
              className="mt-8 inline-flex font-semibold text-[#236f91] underline decoration-[#8bb9cb] underline-offset-4 hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:text-sky-200"
            >
              Explore SparkEd
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-gray-900 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div className="max-w-lg">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-[#173f59] dark:text-white sm:text-5xl">
              Learning doesn&apos;t end at the classroom door.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Whether students are working together at school or studying later on their own, the same materials are ready when they need them.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#c7dce5]">
            <Image
              src="/hero1.jpg"
              alt="A group using phones and tablets together outside a school"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
