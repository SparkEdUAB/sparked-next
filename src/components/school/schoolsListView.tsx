"use client";

import { AdminPageTitle } from "@components/layouts";
import useSchool from "@hooks/useSchool";
import { Input, Table } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import React, { useEffect } from "react";
import { HiTrendingUp } from "react-icons/hi";
import { schoolTableColumns } from ".";
import useNavigation from "@hooks/useNavigation";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
const { Search } = Input;

const SchoolsListView: React.FC = () => {
  const { fetchSchools, schools } = useSchool();
  const { router } = useNavigation();

  useEffect(() => {
    fetchSchools({});
  }, []);

  const rowSelection = {
    selectedRowKeys: [],
    onChange: () => {},
  };

  return (
    <>
      <AdminPageTitle title={i18next.t("schools")} />
      <Search
        className="table-search-box"
        placeholder="Seach for schools"
        enterButton
      />
      <Button.Group>
        <Button
          onClick={()=>router.replace(
            ADMIN_LINKS.schools.children?.filter((i) => i.key === "create")[0]
              .link as string
          )}
          className={"table-action-buttons"}
        >
          <HiTrendingUp className="mr-3 h-4 w-4" />
          New
        </Button>
        <Button className={"table-action-buttons"}>
          <HiTrendingUp className="mr-3 h-4 w-4" />
          Delete
        </Button>
        <Button className={"table-action-buttons"}>
          <HiTrendingUp className="mr-3 h-4 w-4" />
          Edit
        </Button>
      </Button.Group>
      <Table
        bordered
        rowSelection={rowSelection}
        columns={schoolTableColumns}
        dataSource={schools}
      />
    </>
  );
};

export default SchoolsListView;
