export function GET() {
  const response = {
    isError: true,
  };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}

// export { mediaContentGetApiHandler_ as GET, mediaContentPostApiHandler_ as POST };
