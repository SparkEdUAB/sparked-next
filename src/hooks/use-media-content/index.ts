/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import { message } from "antd";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { useEffect, useState } from "react";
import UiStore from "@state/mobx/uiStore";
import { T_createResourceFields, T_fetchTopic } from "./types";
import { T_MediaContentFields } from "types/media-content";
import FileUploadStore from "@state/mobx/fileUploadStore";

const useMediaContent = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mediaContent, setMediaContent] = useState<Array<T_MediaContentFields>>(
    []
  );
  const [tempTopics, setTempMediaContent] = useState<
    Array<T_MediaContentFields>
  >([]);
  const [targetMediaContent, setTargetMediaContent] =
    useState<T_MediaContentFields | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<React.Key[]>([]);
  const { fileUrl } = FileUploadStore;

  useEffect(() => {
    UiStore.confirmDialogStatus && selectedTopicIds.length && deleteTopics();
  }, [UiStore.confirmDialogStatus]);

  const createResource = async (fields: T_createResourceFields) => {
    const url = API_LINKS.CREATE_MEDIA_CONTENT;
    const formData = {
      body: JSON.stringify({ ...fields, fileUrl }),
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

      router.push(ADMIN_LINKS.media_content.link);

      message.success(i18next.t("media content created"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const editMediaContent = async (fields: T_MediaContentFields) => {
    const url = API_LINKS.EDIT_MEDIA_CONTENT;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({
        ...targetMediaContent,
        ...fields,
        mediaContentId: targetMediaContent?._id,
        fileUrl: fileUrl ? fileUrl : targetMediaContent?.file_url,
      }),
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

      router.push(ADMIN_LINKS.media_content.link);

      message.success(i18next.t("success"));
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchMediaContent = async ({
    limit = 1000,
    skip = 0,
  }: T_fetchTopic) => {
    const url = API_LINKS.FETCH_MEDIA_CONTENT;
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

      const _mediaContent = responseData.mediaContent?.map(
        (i: T_MediaContentFields, index: number) => ({
          index: index + 1,
          key: i._id,
          _id: i._id,
          name: i.name,
          fileUrl: i.file_url,
          school: i.school,
          schoolId: i.school?._id,
          unitId: i.course?._id,
          schoolName: i.school?.name,
          programName: i.program?.name,
          courseName: i.course?.name,
          unitName: i.unit?.name,
          programId: i.program?._id,
          topicId: i.topic?._id,
          topicName: i.topic?.name,
          created_by: i.user?.email,
          created_at: new Date(i.created_at as string).toDateString(),
        })
      );

      setMediaContent(_mediaContent);
      setTempMediaContent(_mediaContent);
      return _mediaContent;
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const fetchMediaContentById = async ({
    mediaContentId,
    withMetaData = false,
  }: {
    mediaContentId: string;
    withMetaData: boolean;
  }) => {
    const url = API_LINKS.FETCH_MEDIA_CONTENT_BY_ID;
    const formData = {
      body: JSON.stringify({ mediaContentId, withMetaData }),
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

      if (responseData.mediaContent) {
        const {
          _id,
          name,
          description,
          school,
          program,
          course,
          unit,
          topic,
          file_url,
        } = responseData.mediaContent as T_MediaContentFields;

        const _mediaContent = {
          _id,
          name,
          description,
          schoolId: school?._id,
          programId: program?._id,
          courseId: course?._id,
          unitId: unit?._id,
          topicId: topic?._id,
          fileUrl: file_url,
        };

        setTargetMediaContent(_mediaContent as T_MediaContentFields);
        form && form.setFieldsValue(_mediaContent);
        return _mediaContent;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selectedTopicIds.length) {
      return message.warning(i18next.t("select_items"));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteTopics = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_TOPICS;
    const formData = {
      body: JSON.stringify({ topicIds: selectedTopicIds }),
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

      setMediaContent(
        mediaContent.filter((i) => selectedTopicIds.indexOf(i._id) == -1)
      );

      return responseData.results;
    } catch (err: any) {
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };
  const findTopicsByName = async ({
    withMetaData = false,
  }: {
    withMetaData: boolean;
  }) => {
    if (isLoading) {
      return message.warning(i18next.t("wait"));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t("search_empty"));
    }

    const url = API_LINKS.FIND_TOPIC_BY_NAME;
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
        responseData.topics.length + " " + i18next.t("topics_found")
      );

      setMediaContent(responseData.topics);

      return responseData.topics;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setMediaContent(tempTopics);
    }
  };

  const triggerEdit = async () => {
    if (!selectedTopicIds.length) {
      return message.warning(i18next.t("select_item"));
    } else if (selectedTopicIds.length > 1) {
      return message.warning(i18next.t("select_one_item"));
    }

    router.push(
      getChildLinkByKey("edit", ADMIN_LINKS.media_content) +
        `?mediaContentId=${selectedTopicIds[0]}`
    );
  };

  return {
    createResource,
    fetchMediaContent,
    mediaContent,
    setMediaContent,
    setSelectedTopicIds,
    selectedTopicIds,
    triggerDelete,
    triggerEdit,
    fetchMediaContentById,
    router,
    targetMediaContent,
    isLoading,
    editMediaContent,
    findTopicsByName,
    onSearchQueryChange,
    searchQuery,
    tempTopics,
  };
};

export default useMediaContent;
