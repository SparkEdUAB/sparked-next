import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Space, Tag } from "antd";
import { libraryTags } from "./tags";






const ContentTags: React.FC = () => (
  <div
    style={{
      maxWidth: "100%",
      overflow: "scroll",
      display: "flex",
      flexDirection: "row",
      marginLeft: 50,
      marginRight: 50,
    }}
  >
    {libraryTags.map((i, index) => (
      <Tag style={{height:30,textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <a href="https://github.com/ant-design/ant-design/issues/1862">{i}</a>
      </Tag>
    ))}
  </div>
);

export default ContentTags;
