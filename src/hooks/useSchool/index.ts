"use client";

import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import { TschoolFields } from "@components/school/types";
import useNavigation from "@hooks/useNavigation";
import { message } from "antd";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { useState } from "react";
import { TcreateSchoolFields, TfetchSchools } from "./types";

const useSchool = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [schools, setSchools] = useState<Array<TschoolFields>>([]);
  const [school, setSchool] = useState<TschoolFields | null>(null);
  const [selecetedSchoolIds, setSelectedSchoolIds] = useState<React.Key[]>([]);

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

      router.push(ADMIN_LINKS.schools.link);

      message.success(i18next.t("school_created"));
    } catch (err: any) {
      message.error(
        `${i18next.t("unknown_error")}. ${err.msg ? err.msg : "mmm"}`
      );
      return false;
    }
  };

  const editSchool = async (fields: TschoolFields) => {
    const url = API_LINKS.EDIT_SCHOOL;
    const formData = {
      body: JSON.stringify({ ...fields, _id: school?._id }),
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

      router.push(ADMIN_LINKS.schools.link);

      message.success(i18next.t("success"));
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

      const _schools = responseData.schools?.map(
        (i: TschoolFields, index: number) => ({
          index: index + 1,
          key: i._id,
          name: i.name,
          created_by: i.user.email,
          created_at: new Date(i.created_at).toDateString(),
        })
      );

      setSchools(_schools);
      return _schools;
    } catch (err: any) {
      message.error(
        `${i18next.t("unknown_error")}. ${err.msg ? err.msg : "mmm"}`
      );
      return false;
    }
  };

  const fetchSchool = async (schoolId: string) => {
    const url = API_LINKS.FETCH_SCHOOL;
    const formData = {
      body: JSON.stringify({ schoolId }),
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

      const { _id, name, description } = responseData.school as TschoolFields;

      const _school = {
        _id,
        name,
        description,
      };

      setSchool(_school as TschoolFields);
      form && form.setFieldsValue(_school);
      return _school;
    } catch (err: any) {
      message.error(
        `${i18next.t("unknown_error")}. ${err.msg ? err.msg : "mmm"}`
      );
      return false;
    }
  };

  const triggerDelete = () => {
    if (!selecetedSchoolIds.length)
      return message.warning(i18next.t("select_items"));
  };

  const triggerEdit = async () => {
    if (!selecetedSchoolIds.length) {
      return message.warning(i18next.t("select_item"));
    } else if (selecetedSchoolIds.length > 1) {
      return message.warning(i18next.t("select_one_item"));
    }

    router.push(
      getChildLinkByKey("edit", ADMIN_LINKS.schools) +
        `?schoolId=${selecetedSchoolIds[0]}`
    );
  };

  return {
    createSchool,
    fetchSchools,
    schools,
    setSchools,
    setSelectedSchoolIds,
    selecetedSchoolIds,
    triggerDelete,
    triggerEdit,
    fetchSchool,
    router,
    school,
    isLoading,
    editSchool,
  };
};

export default useSchool;
