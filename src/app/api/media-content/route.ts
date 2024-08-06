import { HttpStatusCode } from 'axios';

export function GET() {
  const response = {
    isError: true,
  };
  return new Response(JSON.stringify(response), {
    status: HttpStatusCode.NotFound,
  });
}

// export { mediaContentGetApiHandler_ as GET, mediaContentPostApiHandler_ as POST };
