"use client";

import { AdminPageTitle } from "@components/layouts";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import useUnit from "@hooks/useUnit";
import { Table } from "antd";
import { Button, TextInput } from "flowbite-react";
import i18next from "i18next";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import {
  HiMagnifyingGlass,
  HiOutlineNewspaper,
  HiOutlinePencilSquare,
  HiTrash,
} from "react-icons/hi2";
import { unitTableColumns } from ".";
import { TunitFields } from "./types";

const UnitListView: React.FC = observer(() => {
  const {
    fetchUnits,
    units,
    selecetedUnitIds,
    setSelectedProgramIds,
    triggerDelete,
    triggerEdit,
    findUnitsByName,
    onSearchQueryChange,
  } = useUnit();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchUnits({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selecetedUnitIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: TunitFields[]) => {
      setSelectedProgramIds(selectedRows.map((i) => i.key));
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t("units")} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t("search_units")}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findUnitsByName({ withMetaData: true }) : null;
        }}
      />
      <Button.Group>
        <Button
          onClick={() =>
            router.push(getChildLinkByKey("create", ADMIN_LINKS.units))
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
        columns={unitTableColumns}
        //@ts-ignore
        dataSource={units || []}
      />
    </>
  );
});

export default UnitListView;
