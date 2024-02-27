"use client";

import GuestLayout from "@components/layouts/guestLayout";
import LibraryLayout from "@components/layouts/library";
import { bookTitles } from "@components/layouts/library/book-titles";
import ContentCardView from "@components/layouts/library/content-card";
import { Col, Row } from "antd";
import React from "react";

const LibraryPage: React.FC = (props) => {
  return (
    <GuestLayout>
      <LibraryLayout>
        <Row gutter={16}>
          {new Array(100).fill("i").map((i, index) => (
            <Col
              style={{ padding: "8px 0" }}
              key={index}
              className="gutter-row"
              span={6}
            >
              <ContentCardView title={bookTitles[index]} />
            </Col>
          ))}
        </Row>
      </LibraryLayout>
    </GuestLayout>
  );
};

export default LibraryPage;
