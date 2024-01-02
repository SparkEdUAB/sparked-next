import { InboxOutlined } from "@ant-design/icons";
import useFileUpload from "@hooks/use-file-upload";
import { Upload } from "antd";
import { Button } from "flowbite-react";
import React from "react";

const { Dragger } = Upload;

const UploadView: React.FC = () => {
  const { uploadProps, fileList, uploadFile } = useFileUpload();

  return (
    <Dragger
      fileList={fileList}
      {...uploadProps({ name: "file", multiple: false })}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
      <Button onClick={uploadFile} color="dark">
        Upload
      </Button>
    </Dragger>
  );
};

export default UploadView;
