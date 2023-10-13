"use client";

import { message } from "antd";
import { API_LINKS } from "app/links";
import { useSession } from "next-auth/react";
import { TloginFields, TsignupFields } from "./types";
import i18next from "i18next";
import { signIn, signOut } from "next-auth/react";
import AUTH_PROCESS_CODES from "@app/api/auth/processCodes";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

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
        message.warning(
          responseData.code === AUTH_PROCESS_CODES.USER_ALREADY_EXIST
            ? i18next.t("user_already_exist")
            : i18next.t("unknown_error")
        );
        return false;
      }
      message.success(
        responseData.code === AUTH_PROCESS_CODES.USER_CREATED
          ? i18next.t("account_created")
          : i18next.t("unknown_error")
      );
      router.replace('/');
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
        message.warning(responseData.code);
        return false;
      }

      const { user } = responseData;

      const respd = await signIn("credentials", {
        redirect: false,
        user: JSON.stringify(user),
      });

      router.replace("/");

      message.success(i18next.t("logged_in"));
    } catch (err: any) {
      message.error(
        `${i18next.t("unknown_error")}. ${err.msg ? err.msg : "mmm"}`
      );
      return false;
    }
  };

  const handleLogout = async () => {
    const url = API_LINKS.LOGOUT;
    const formData = {
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
        message.warning(
          responseData.code === AUTH_PROCESS_CODES.FAILED_TO_LOGOUT_USER
            ? i18next.t("logout_failed")
            : i18next.t("unknown_error")
        );
        return false;
      }

      const respd = await signOut({ redirect: false, callbackUrl: "/" });

      message.success(i18next.t("logout_ok"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  return {
    isAuthenticated,
    handleSignup,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
