"use client";

import { AdminPageTitle } from "@components/layouts";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import useSchool from "@hooks/useSchool";
import { Input, Table } from "antd";
import { Button, TextInput } from "flowbite-react";
import i18next from "i18next";
import React, { useEffect } from "react";
import {
  HiOutlineNewspaper,
  HiOutlinePencilSquare,
  HiTrash,
  HiMagnifyingGlass,
} from "react-icons/hi2";
import { schoolTableColumns } from ".";
import { TschoolFields } from "./types";
import { observer } from "mobx-react-lite";
const { Search } = Input;

const SchoolsListView: React.FC = () => {
  const {
    fetchSchools,
    schools,
    selecetedSchoolIds,
    setSelectedSchoolIds,
    triggerDelete,
    triggerEdit,
    findSchoolsByName,
    onSearchQueryChange,
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

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t("search_schools")}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findSchoolsByName() : null;
        }}
      />
      <Button.Group>
        <Button
          onClick={() =>
            router.push(getChildLinkByKey("create", ADMIN_LINKS.schools))
          }
          className={"table-action-buttons"}
        >
          <HiOutlinePencilSquare className="mr-3 h-4 w-4" />
          {i18next.t("new")}
        </Button>
        <Button onClick={triggerDelete} className={"table-action-buttons"}>
          <HiTrash className="mr-3 h-4 w-4" />
          {i18next.t("delete")}
        </Button>
        <Button onClick={triggerEdit} className={"table-action-buttons"}>
          <HiOutlineNewspaper className="mr-3 h-4 w-4" />
          {i18next.t("edit")}
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

export default observer(SchoolsListView);
