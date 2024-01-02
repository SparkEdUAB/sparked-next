/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useNavigation from "@hooks/useNavigation";
import { UploadProps, message, UploadFile } from "antd";
import { useState } from "react";

const useFileUpload = () => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
       multiple
         ? setFileList([...fileList, file])
         : setFileList([file]);

        return false;
      },
    };
  };

  return {
    uploadProps,
    fileList,
  };
};

export default useFileUpload;
