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
import { TcreateProgramFields, TfetchPrograms, TProgramFields } from "./types";

const useProgram = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [programs, setPrograms] = useState<Array<TschoolFields>>([]);
  const [tempPrograms, setTempPrograms] = useState<Array<TschoolFields>>([]);
  const [program, setSProgram] = useState<TProgramFields | null>(null);
  const [selecetedProgramIds, setSelectedProgramIds] = useState<React.Key[]>(
    []
  );

  useEffect(() => {
    UiStore.confirmDialogStatus &&
      selecetedProgramIds.length &&
      deletePrograms();
  }, [UiStore.confirmDialogStatus]);

  const createProgram = async (fields: TcreateProgramFields) => {
    const url = API_LINKS.CREATE_PROGRAM;
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

      router.push(ADMIN_LINKS.programs.link);

      message.success(i18next.t("program_created"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const editProgram = async (fields: TschoolFields) => {
    const url = API_LINKS.EDIT_PROGRAM;
    const formData = {
      body: JSON.stringify({ ...fields, _id: program?._id }),
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

      router.push(ADMIN_LINKS.programs.link);

      message.success(i18next.t("success"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchPrograms = async ({ limit = 1000, skip = 0 }: TfetchPrograms) => {
    const url = API_LINKS.FETCH_PROGRAMS;
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

      const _programs = responseData.programs?.map(
        (i: TProgramFields, index: number) => ({
          index: index + 1,
          key: i._id,
          _id: i._id,
          name: i.name,
          school: i.school,
          schoolId: i.school?._id,
          schoolName: i.school?.name,
          created_by: i.user?.email,
          created_at: new Date(i.created_at).toDateString(),
        })
      );

      setPrograms(_programs);
      setTempPrograms(_programs);
      return _programs;
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchProgramById = async ({
    programId,
    withMetaData = false,
  }: {
    programId: string;
    withMetaData: boolean;
  }) => {
    const url = API_LINKS.FETCH_PROGRAM_BY_ID;
    const formData = {
      body: JSON.stringify({ programId, withMetaData }),
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

      if (responseData.program) {
        const { _id, name, description, school } =
          responseData.program as TProgramFields;

        const _program = {
          _id,
          name,
          description,
          schoolId: school?._id,
        };

        setSProgram(_program as TProgramFields);
        form && form.setFieldsValue(_program);
        return _program;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selecetedProgramIds.length) {
      return message.warning(i18next.t("select_items"));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deletePrograms = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_PROGRAMS;
    const formData = {
      body: JSON.stringify({ programIds: selecetedProgramIds }),
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

      setPrograms(
        programs.filter((i) => selecetedProgramIds.indexOf(i._id) == -1)
      );

      return responseData.results;
    } catch (err: any) {
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };
  const findProgramsByName = async ({
    withMetaData=false,
  }: {
    withMetaData: boolean;
  }) => {
    if (isLoading) {
      return message.warning(i18next.t("wait"));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t("search_empty"));
    }

    const url = API_LINKS.FIND_PROGRAMS_BY_NAME;
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
        responseData.programs.length + " " + i18next.t("programs_found")
      );

      setPrograms(responseData.programs);

      return responseData.programs;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setPrograms(tempPrograms);
    }
  };

  const triggerEdit = async () => {
    if (!selecetedProgramIds.length) {
      return message.warning(i18next.t("select_item"));
    } else if (selecetedProgramIds.length > 1) {
      return message.warning(i18next.t("select_one_item"));
    }

    router.push(
      getChildLinkByKey("edit", ADMIN_LINKS.programs) +
        `?programId=${selecetedProgramIds[0]}`
    );
  };

  return {
    createProgram,
    fetchPrograms,
    programs,
    setPrograms,
    setSelectedProgramIds,
    selecetedProgramIds,
    triggerDelete,
    triggerEdit,
    fetchProgramById,
    router,
    program,
    isLoading,
    editProgram,
    findProgramsByName,
    onSearchQueryChange,
    searchQuery,
    tempPrograms,
  };
};

export default useProgram;
