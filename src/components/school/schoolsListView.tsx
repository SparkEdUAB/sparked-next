"use client";

import useSchool from "@hooks/useSchool";
import { Row } from "antd";
import { useEffect } from "react";
import { Input } from "antd";

const { Search } = Input;
import { Table } from "antd";
import React from "react";
import { schoolTableColumns } from ".";

const SchoolsListView: React.FC = () => {
  const { fetchSchools, schools } = useSchool();

  useEffect(() => {
    fetchSchools({});
  }, []);

  return (
    <>
      <Search
        className="table-search-box"
        placeholder="Seach for schools"
        enterButton
      />

      <Table columns={schoolTableColumns} dataSource={schools} />
    </>
  );
};

export default SchoolsListView;
