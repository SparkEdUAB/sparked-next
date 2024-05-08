export function GET(req: Request) {
  const response = {
    isError: true,
  };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}

// export { mediaContentGetApiHandler_ as GET, mediaContentPostApiHandler_ as POST };
