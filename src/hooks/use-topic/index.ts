/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import { message } from "antd";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { useEffect, useState } from "react";
import UiStore from "@state/mobx/uiStore";
import { TcreateTopicFields, T_fetchTopic, T_topicFields } from "./types";

const useTopic = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [topics, setTopics] = useState<Array<T_topicFields>>([]);
  const [tempUnits, setTempUnits] = useState<Array<T_topicFields>>([]);
  const [topic, setTopic] = useState<T_topicFields | null>(null);
  const [selecetedTopicIds, setSelectedTopicIds] = useState<React.Key[]>([]);

  useEffect(() => {
    UiStore.confirmDialogStatus && selecetedTopicIds.length && deleteTopics();
  }, [UiStore.confirmDialogStatus]);

  const createTopic = async (fields: TcreateTopicFields) => {
    const url = API_LINKS.CREATE_TOPIC;
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

      router.push(ADMIN_LINKS.topics.link);

      message.success(i18next.t("topic_created"));
    } catch (err: any) {
      console.log("createTopic:errr", err);

      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const editTopic = async (fields: T_topicFields) => {
    const url = API_LINKS.EDIT_TOPIC;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...topic, ...fields, topicId: topic?._id }),
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

      router.push(ADMIN_LINKS.topics.link);

      message.success(i18next.t("success"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchTopics = async ({ limit = 1000, skip = 0 }: T_fetchTopic) => {
    const url = API_LINKS.FETCH_TOPICS;
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

      const _units = responseData.units?.map(
        (i: T_topicFields, index: number) => ({
          index: index + 1,
          key: i._id,
          _id: i._id,
          name: i.name,
          school: i.school,
          schoolId: i.school?._id,
          unitId: i.course?._id,
          schoolName: i.school?.name,
          programName: i.program?.name,
          courseName: i.course?.name,
          unitName: i.unit?.name,
          programId: i.program?._id,
          created_by: i.user?.email,
          created_at: new Date(i.created_at).toDateString(),
        })
      );

      setTopics(_units);
      setTempUnits(_units);
      return _units;
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchTopicById = async ({
    topicId,
    withMetaData = false,
  }: {
    topicId: string;
    withMetaData: boolean;
  }) => {
    const url = API_LINKS.FETCH_TOPIC_BY_ID;
    const formData = {
      body: JSON.stringify({ topicId, withMetaData }),
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

      if (responseData.topic) {
        const { _id, name, description, school, program, course, unit } =
          responseData.topic as T_topicFields;

        const _topic = {
          _id,
          name,
          description,
          schoolId: school?._id,
          programId: program?._id,
          courseId: course?._id,
          unitId: unit?._id,
        };

        setTopic(_topic as T_topicFields);
        form && form.setFieldsValue(_topic);
        return _topic;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selecetedTopicIds.length) {
      return message.warning(i18next.t("select_items"));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteTopics = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_TOPICS;
    const formData = {
      body: JSON.stringify({ topicIds: selecetedTopicIds }),
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

      setTopics(topics.filter((i) => selecetedTopicIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };
  const findUnitsByName = async ({
    withMetaData = false,
  }: {
    withMetaData: boolean;
  }) => {
    if (isLoading) {
      return message.warning(i18next.t("wait"));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t("search_empty"));
    }

    const url = API_LINKS.FIND_UNITS_BY_NAME;
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

      setTopics(responseData.courses);

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
      setTopics(tempUnits);
    }
  };

  const triggerEdit = async () => {
    if (!selecetedTopicIds.length) {
      return message.warning(i18next.t("select_item"));
    } else if (selecetedTopicIds.length > 1) {
      return message.warning(i18next.t("select_one_item"));
    }

    router.push(
      getChildLinkByKey("edit", ADMIN_LINKS.topics) +
        `?topicId=${selecetedTopicIds[0]}`
    );
  };

  return {
    createTopic,
    fetchTopics,
    topics,
    setTopics,
    setSelectedTopicIds,
    selecetedTopicIds,
    triggerDelete,
    triggerEdit,
    fetchTopicById,
    router,
    topic,
    isLoading,
    editTopic,
    findUnitsByName,
    onSearchQueryChange,
    searchQuery,
    tempUnits,
  };
};

export default useTopic;
