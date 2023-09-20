export default async function signup_() {
  // NextResponse.json({
  //   isError: true,
  //   msg: "Sorry you are not authenticated",
  // });

  const response = { isError: false,msg:'it worked again' };


  return new Response(JSON.stringify(response), {
    status: 200,

  });
}
