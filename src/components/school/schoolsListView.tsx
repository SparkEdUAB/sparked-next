"use client";

import useSchool from "@hooks/useSchool";
import { Row } from "antd";
import { useEffect } from "react";

import React from "react";
import { Space, Table, Tag } from "antd";
import { schoolTableColumns } from ".";

const SchoolsListView: React.FC = () => {
  const { fetchSchools, schools } = useSchool();

  useEffect(() => {
    fetchSchools({});
  }, []);

  return (
    <Row className="">
      <Table columns={schoolTableColumns} dataSource={schools} />
    </Row>
  );
};

export default SchoolsListView;
