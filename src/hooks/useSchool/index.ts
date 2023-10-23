"use client";

import { TcreateSchoolFields } from "./types";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { message } from "antd";
import { useRouter } from "next/navigation";

const useSchool = () => {
  const router = useRouter();

  const createSchool = async (fields: TcreateSchoolFields) => {
    const url = API_LINKS.CREATE_SCHOOL;
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

      router.replace("/");

      message.success(i18next.t("school_created"));
    } catch (err: any) {
      message.error(
        `${i18next.t("unknown_error")}. ${err.msg ? err.msg : "mmm"}`
      );
      return false;
    }
  };

  return {
    createSchool,
  };
};

export default useSchool;
