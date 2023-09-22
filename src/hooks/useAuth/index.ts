import { message } from "antd";
import { API_LINKS } from "app/links";
import { useSession } from "next-auth/react";
import { TsignupFields } from "./types";
import { translate } from "utils/intl";
import { WORDS } from "utils/intl/data/constants";

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
        message.warning(translate(WORDS.unknown_error));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.msg);
        return false;
      }
      message.success(responseData.msg);
    } catch (err: any) {
      message.error(
        `${translate(WORDS.unknown_error)}. ${err.msg ? err.msg : ""}`
      );
      return false;
    }
  };

  return {
    isAuthenticated,
    handleSignup,
  };
};

export default useAuth;
