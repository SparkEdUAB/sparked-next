"use client";

import { AdminPageTitle } from "@components/layouts";
import useSchool from "@hooks/useSchool";
import { Input, Table } from "antd";
import i18next from "i18next";
import React, { useEffect } from "react";
import { schoolTableColumns } from ".";

const { Search } = Input;

const SchoolsListView: React.FC = () => {
  const { fetchSchools, schools } = useSchool();

  useEffect(() => {
    fetchSchools({});
  }, []);

  return (
    <>
      <AdminPageTitle title={i18next.t("schools")} />
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
