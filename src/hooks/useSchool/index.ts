"use client";

import {
  TschoolTableFields,
  TcreateSchoolFields,
  TfetchSchools,
} from "./types";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useSchool = () => {
  const router = useRouter();

  const [schools, setSchools] = useState<Array<TschoolTableFields>>([]);

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
  const fetchSchools = async ({ limit = 1000, skip = 0 }: TfetchSchools) => {
    const url = API_LINKS.FETCH_SCHOOLS;
    const formData = {
      body: JSON.stringify({ limit, skip }),
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

      const _schools = responseData.schools?.map((i: TschoolTableFields) => ({
        key: i._id,
        name: i.name,
      }));

      setSchools(_schools);
      return _schools;
    } catch (err: any) {
      message.error(
        `${i18next.t("unknown_error")}. ${err.msg ? err.msg : "mmm"}`
      );
      return false;
    }
  };

  return {
    createSchool,
    fetchSchools,
    schools,
    setSchools,
  };
};

export default useSchool;
