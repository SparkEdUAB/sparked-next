import Link from 'next/link';

export function LoginSignupLinks() {
  return (
    <>
      <Link href="/auth/login" className="text-sky-600 dark:text-sky-400 font-medium mr-2">
        Log in
      </Link>
      <Link
        href="/auth/signup"
        className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-sky-600 dark:hover:bg-sky-700 focus:outline-none dark:focus:ring-sky-800"
      >
        Sign Up
      </Link>
    </>
  );
}
