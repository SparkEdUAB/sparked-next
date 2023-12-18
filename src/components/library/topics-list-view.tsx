"use client";

import { AdminPageTitle } from "@components/layouts";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import useTopic from "@hooks/use-topic";
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
import { topicTableColumns } from ".";
import { TunitFields } from "./types";

const TopicsListView: React.FC = observer(() => {
  const {
    fetchTopics,
    topics,
    selecetedTopicIds,
    setSelectedTopicIds,
    triggerDelete,
    triggerEdit,
    findTopicsByName,
    onSearchQueryChange,
  } = useTopic();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchTopics({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selecetedTopicIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: TunitFields[]) => {
      setSelectedTopicIds(selectedRows.map((i) => i.key));
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t("topics")} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t("search_units")}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findTopicsByName({ withMetaData: true }) : null;
        }}
      />
      <Button.Group>
        <Button
          onClick={() =>
            router.push(getChildLinkByKey("create", ADMIN_LINKS.topics))
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
        columns={topicTableColumns}
        //@ts-ignore
        dataSource={topics || []}
      />
    </>
  );
});

export default TopicsListView;
