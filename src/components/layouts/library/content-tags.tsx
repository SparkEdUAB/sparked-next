import { Tag } from "antd";
import React from "react";
import { libraryTags } from "./tags";

const ContentTags: React.FC = () => (
  <div
    className="content-tag-container"
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
      <Tag
        key={index}
        style={{
          height: 40,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <a href="#">{i}</a>
      </Tag>
    ))}
  </div>
);

export default ContentTags;
