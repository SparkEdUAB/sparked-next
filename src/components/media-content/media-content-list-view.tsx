"use client";

import { AdminPageTitle } from "@components/layouts";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useMediaContent from "@hooks/use-media-content";
import useNavigation from "@hooks/useNavigation";
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
import { mediaContentTableColumns } from ".";
import { T_unitFields } from "./types";

const MediaContentListView: React.FC = observer(() => {
  const {
    fetchMediaContent,
    mediaContent,
    selectedTopicIds,
    setSelectedTopicIds,
    triggerDelete,
    triggerEdit,
    findMediaContentByName,
    onSearchQueryChange,
  } = useMediaContent();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchMediaContent({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedTopicIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: T_unitFields[]) => {
      setSelectedTopicIds(selectedRows.map((i) => i.key));
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t("media_content")} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t("search_media_content")}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findMediaContentByName({ withMetaData: true }) : null;
        }}
      />
      <Button.Group>
        <Button
          onClick={() =>
            router.push(getChildLinkByKey("create", ADMIN_LINKS.media_content))
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
        //@ts-ignore
        columns={mediaContentTableColumns}
        //@ts-ignore
        dataSource={mediaContent || []}
      />
    </>
  );
});

export default MediaContentListView;
