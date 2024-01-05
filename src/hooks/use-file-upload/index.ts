/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useNavigation from "@hooks/useNavigation";
import { AXIOS_PROCESS_STATUS } from "@hooks/useNavigation/constants";
import FileUploadStore from "@state/mobx/fileUploadStore";
import { UploadProps, message, UploadFile } from "antd";
import { API_LINKS } from "app/links";
import i18next from "i18next";
import { useState } from "react";

const useFileUpload = () => {
  const { getChildLinkByKey, router, apiNavigator } = useNavigation();

  const { fileUrl } = FileUploadStore;

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [fileList, setFileList] = useState<(Blob | UploadFile)[]>([]);

  const uploadFile = async () => {
    const url = API_LINKS.FILE_UPLOAD;

    const formData = new FormData();

    console.log("fileList[0]", fileList[0]);

    formData.append("file", fileList[0] as Blob);

    const metaData = {
      body: JSON.stringify({}),
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const resp = await apiNavigator.post(url, formData);

      if (resp.status !== AXIOS_PROCESS_STATUS.OK.code) {
        message.warning(i18next.t("unknown_error"));
        return false;
      }

      if (resp.data.isError) {
        message.warning(i18next.t("unknown_error"));
        return false;
      }

      message.success(i18next.t("media content created"));

      const fileUrl = resp.data.url;

      console.log("fileUrl", fileUrl);

      FileUploadStore.setFileUrl(fileUrl);

      return fileUrl;
    } catch (err: any) {
      message.error(`${i18next.t("unknown_error")}. ${err.msg ? err.msg : ""}`);
      return false;
    }
  };

  const uploadProps = ({
    name,
    multiple,
  }: {
    name: string;
    multiple: boolean;
  }): UploadProps => {
    return {
      name,
      multiple,
      onChange(info) {
        const { file } = info;

        multiple ? setFileList([...fileList, file]) : setFileList([file]);

        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
      },

      beforeUpload: (file) => {
        return false;
      },
    };
  };

  return {
    uploadProps,
    fileList,
    uploadFile,
    fileUrl,
  };
};

export default useFileUpload;
