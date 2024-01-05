import { InboxOutlined } from "@ant-design/icons";
import useFileUpload from "@hooks/use-file-upload";
import { Upload, UploadFile } from "antd";
import React from "react";
import { StyledUploadBtn, StyledUploadBtnContainer } from "./style";
import { observer } from "mobx-react-lite";

const { Dragger } = Upload;

const UploadView: React.FC = () => {
  const { uploadProps, fileList, uploadFile, } = useFileUpload();

  return (
    <StyledUploadBtnContainer>
      <Dragger
        fileList={fileList as UploadFile[]}
        {...uploadProps({ name: "file", multiple: false })}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <StyledUploadBtn
        disabled={!fileList.length}
        onClick={uploadFile}
        color="dark"
      >
        Upload
      </StyledUploadBtn>
    </StyledUploadBtnContainer>
  );
};

export default observer(UploadView);
