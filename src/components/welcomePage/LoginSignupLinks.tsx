import Link from 'next/link';

export function LoginSignupLinks() {
  return (
    <>
      <Link href="/auth/login" className="text-sm font-semibold text-[#236f91] hover:text-[#174f6b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:text-sky-200">
        Log in
      </Link>
      <Link
        href="/auth/signup"
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#287fa3] px-4 text-sm font-semibold text-[#236f91] transition-colors hover:bg-[#d9edf4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#287fa3] dark:border-sky-300 dark:text-sky-100 dark:hover:bg-white/10"
      >
        Sign up
      </Link>
    </>
  );
}
