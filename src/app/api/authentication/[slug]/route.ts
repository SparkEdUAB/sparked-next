import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import Login_ from "../../auth/login";
import signup_ from "../../auth/signup";

const authApiHandler_ = async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  const authFunctions: { [key: string]: (request: Request) => {} } = {
    signup: signup_,
    login: Login_,
  };

  if (authFunctions[slug]) {
    return authFunctions[slug](request);
  } else {
    const response = {
      isError: true,
      code: SPARKED_PROCESS_CODES.METHOD_NOT_FOUND,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
};

export { authApiHandler_ as POST };
