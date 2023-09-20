import { message } from "antd";
import { API_LINKS } from "app/links";
import { useSession } from "next-auth/react";
import { TsignupFields } from "./types";

const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";

  const handleSignup = async (fields: TsignupFields) => {
    const url = API_LINKS.SIGNUP;
    const formData = {
      body: JSON.stringify({ ...fields }),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const resp = await fetch(url, formData);

      if (!resp.ok) {
        message.warning(`Sorry something went wrong `);
        return false;
      }

      const responseData = await resp.json();
      console.log(responseData);
    } catch (err: any) {
      message.error(`Sorry an error occured. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  return {
    isAuthenticated,
    handleSignup,
  };
};

export default useAuth;
