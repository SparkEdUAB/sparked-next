import signup_ from "../signup";

const authApiHandler_ = async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  const authFunctions: { [key: string]: (request: Request) => {} } = {
    signup: signup_,
  };

  if (authFunctions[slug]) {
    return authFunctions[slug](request);
  } else {
    const response = { isError: true };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
};

export { authApiHandler_ as POST };
