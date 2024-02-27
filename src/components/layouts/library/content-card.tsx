"use client";

import {
  DislikeOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
import Image from "next/image";
import React from "react";

const { Meta } = Card;

const { Text, Link } = Typography;

const ContentDetailsCardView: React.FC<{ title: string }> = ({
  title = "",
}) => (
  <Card
    style={{ margin: 10, borderRadius: 20 }}
    cover={
      <Image
        alt="example"
        src="https://cdn.pixabay.com/photo/2023/06/16/11/47/books-8067850_1280.jpg"
      />
    }
    actions={[
      <LikeOutlined key={1} />,
      <DislikeOutlined key={2} />,
      <ShareAltOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={
        <Avatar src="https://cdn.pixabay.com/photo/2017/09/21/13/32/girl-2771936_1280.jpg" />
      }
      title={title}
      description="This is the description"
    />

    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
        margin: 5,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text type="secondary">200 views</Text>
      <Text type="secondary">3hrs ago</Text>
    </div>
  </Card>
);

export default ContentDetailsCardView;
