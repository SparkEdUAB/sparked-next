"use client";

import { AdminPageTitle } from "@components/layouts";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import useSchool from "@hooks/useSchool";
import { Input, Table } from "antd";
import { Button } from "flowbite-react";
import i18next from "i18next";
import React, { useEffect } from "react";
import {
  HiOutlineNewspaper,
  HiOutlinePencilSquare,
  HiTrash,
} from "react-icons/hi2";
import { schoolTableColumns } from ".";
import { TschoolFields } from "./types";
const { Search } = Input;

const SchoolsListView: React.FC = () => {
  const {
    fetchSchools,
    schools,
    selecetedSchoolIds,
    setSelectedSchoolIds,
    triggerDelete,
    triggerEdit,
  } = useSchool();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchSchools({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selecetedSchoolIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: TschoolFields[]) => {
      setSelectedSchoolIds(selectedRows.map((i) => i.key));
    },
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
          onClick={() =>
            router.replace(getChildLinkByKey("create", ADMIN_LINKS.schools))
          }
          className={"table-action-buttons"}
        >
          <HiOutlinePencilSquare className="mr-3 h-4 w-4" />
          New
        </Button>
        <Button onClick={triggerDelete} className={"table-action-buttons"}>
          <HiTrash className="mr-3 h-4 w-4" />
          Delete
        </Button>
        <Button onClick={triggerEdit} className={"table-action-buttons"}>
          <HiOutlineNewspaper className="mr-3 h-4 w-4" />
          Edit
        </Button>
      </Button.Group>
      <Table
        className="admin-table"
        bordered
        rowSelection={rowSelection}
        columns={schoolTableColumns}
        dataSource={schools}
      />
    </>
  );
};

export default SchoolsListView;
