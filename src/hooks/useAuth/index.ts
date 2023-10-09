import { message } from "antd";
import { API_LINKS } from "app/links";
import { useSession } from "next-auth/react";
import { TloginFields, TsignupFields } from "./types";
import i18next from "i18next";

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
        message.warning(i18next.t("unknown_error"));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.msg);
        return false;
      }
      message.success(responseData.msg);
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const handleLogin = async (fields: TloginFields) => {
    const url = API_LINKS.LOGIN;
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
        message.warning(i18next.t("unknown_error"));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.msg);
        return false;
      }
      message.success(i18next.t("logged_in"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  return {
    isAuthenticated,
    handleSignup,
    handleLogin,
  };
};

export default useAuth;
