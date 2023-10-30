import SPARKED_PROCESS_CODES from "app/shared/processCodes";
import login_ from "../../auth/login";
import signup_ from "../../auth/signup";
import logout_ from "@app/api/auth";

const authApiHandler_ = async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  const authFunctions: { [key: string]: (request: Request) => {} } = {
    signup: signup_,
    login: login_,
    logout: logout_,
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
