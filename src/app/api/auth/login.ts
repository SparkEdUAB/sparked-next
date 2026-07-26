import AUTH_PROCESS_CODES from './processCodes';
import { HttpStatusCode } from 'axios';
import { z } from 'zod';
import { authenticateCredentials } from './credentials';

export default async function login_(request: Request) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  try {
    const { email, password } = schema.parse(await request.json());
    const user = await authenticateCredentials(email, password);

    if (!user) {
      return new Response(
        JSON.stringify({
          isError: true,
          code: AUTH_PROCESS_CODES.INVALID_CREDENTIALS,
        }),
        { status: HttpStatusCode.Unauthorized },
      );
    }

    const response = {
      isError: false,
      code: AUTH_PROCESS_CODES.USER_LOGGED_IN_OK,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phone,
        organizationId: user.organizationId,
        organizationSlug: user.organizationSlug,
        organizationType: user.organizationType,
        isDefaultOrganization: user.isDefaultOrganization,
        isPlatformAdmin: user.isPlatformAdmin,
      },
      jwtToken: null,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const resp = {
      isError: true,
      code: AUTH_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.BadRequest,
    });
  }
}
