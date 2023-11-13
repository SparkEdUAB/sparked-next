/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import { TschoolFields } from "@components/school/types";
import useNavigation from "@hooks/useNavigation";
import { message } from "antd";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { useEffect, useState } from "react";
import UiStore from "@state/mobx/uiStore";
import { TcreateUnitFields, TfetchUnits, TUnitFields } from "./types";

const useUnit = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courses, setUnits] = useState<Array<TschoolFields>>([]);
  const [tempCourse, setTempUnit] = useState<Array<TschoolFields>>([]);
  const [course, setCourse] = useState<TUnitFields | null>(null);
  const [selecetedCourseIds, setSelectedProgramIds] = useState<React.Key[]>([]);

  useEffect(() => {
    UiStore.confirmDialogStatus && selecetedCourseIds.length && deleteCourse();
  }, [UiStore.confirmDialogStatus]);

  const createUnit = async (fields: TcreateUnitFields) => {
    const url = API_LINKS.CREATE_UNIT;
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

      router.push(ADMIN_LINKS.units.link);

      message.success(i18next.t("unit_created"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const editCourse = async (fields: TschoolFields) => {
    const url = API_LINKS.EDIT_COURSE;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...course, ...fields, courseId: course?._id }),
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

      router.push(ADMIN_LINKS.courses.link);

      message.success(i18next.t("success"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchUnits = async ({ limit = 1000, skip = 0 }: TfetchUnits) => {
    const url = API_LINKS.FETCH_UNIT;
    const formData = {
      body: JSON.stringify({ limit, skip, withMetaData: true }),
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

      console.log("responseData.units", responseData.units);

      const _units = responseData.units?.map(
        (i: TUnitFields, index: number) => ({
          index: index + 1,
          key: i._id,
          _id: i._id,
          name: i.name,
          school: i.school,
          schoolId: i.school?._id,
          courseId: i.course?._id,
          schoolName: i.school?.name,
          programName: i.program?.name,
          courseName: i.course?.name,
          programId: i.program?._id,
          created_by: i.user?.email,
          created_at: new Date(i.created_at).toDateString(),
        })
      );

      setUnits(_units);
      setTempUnit(_units);
      return _units;
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchCourseById = async ({
    courseId,
    withMetaData = false,
  }: {
    courseId: string;
    withMetaData: boolean;
  }) => {
    const url = API_LINKS.FETCH_COURSE_BY_ID;
    const formData = {
      body: JSON.stringify({ courseId, withMetaData }),
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

      if (responseData.course) {
        const { _id, name, description, school, program } =
          responseData.course as TUnitFields;

        const _course = {
          _id,
          name,
          description,
          schoolId: school?._id,
          programId: program?._id,
        };

        setCourse(_course as TUnitFields);
        form && form.setFieldsValue(_course);
        return _course;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selecetedCourseIds.length) {
      return message.warning(i18next.t("select_items"));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteCourse = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_COURSES;
    const formData = {
      body: JSON.stringify({ courseIds: selecetedCourseIds }),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      UiStore.setLoaderStatus(true);
      const resp = await fetch(url, formData);
      UiStore.setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t("unknown_error"));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }

      UiStore.setConfirmDialogVisibility(false);
      message.success(i18next.t("success"));

      setUnits(courses.filter((i) => selecetedCourseIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };
  const findCourseByName = async ({
    withMetaData = false,
  }: {
    withMetaData: boolean;
  }) => {
    if (isLoading) {
      return message.warning(i18next.t("wait"));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t("search_empty"));
    }

    const url = API_LINKS.FIND_COURSE_BY_NAME;
    const formData = {
      body: JSON.stringify({
        name: searchQuery.trim(),
        limit: 1000,
        skip: 0,
        withMetaData,
      }),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url, formData);
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t("unknown_error"));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }
      message.success(
        responseData.courses.length + " " + i18next.t("courses_found")
      );

      setUnits(responseData.courses);

      return responseData.courses;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setUnits(tempCourse);
    }
  };

  const triggerEdit = async () => {
    if (!selecetedCourseIds.length) {
      return message.warning(i18next.t("select_item"));
    } else if (selecetedCourseIds.length > 1) {
      return message.warning(i18next.t("select_one_item"));
    }

    router.push(
      getChildLinkByKey("edit", ADMIN_LINKS.courses) +
        `?courseId=${selecetedCourseIds[0]}`
    );
  };

  return {
    createUnit,
    fetchUnits,
    courses,
    setUnits,
    setSelectedProgramIds,
    selecetedCourseIds,
    triggerDelete,
    triggerEdit,
    fetchCourseById,
    router,
    course,
    isLoading,
    editCourse,
    findCourseByName,
    onSearchQueryChange,
    searchQuery,
    tempCourse,
  };
};

export default useUnit;
