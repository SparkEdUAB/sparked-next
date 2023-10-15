"use client";

import AppLogo from "@components/logo";
import useSideBarNav from "@hooks/useSideBarNav";
import { Badge, Sidebar } from "flowbite-react";
import i18next from "i18next";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

const AdminSidebar = () => {
  const { fetchAdminMenuItems } = useSideBarNav();

  const menuItems = fetchAdminMenuItems();

  return (
    <Sidebar aria-label="Sidebar with logo branding">
      <AppLogo />
      <Sidebar.Items className="admin-menu">
        <Sidebar.ItemGroup>
          {menuItems.map((i) => (
            <Sidebar.Item key={i.key} href={i.link} icon={i.icon}>
              <p>{i.label}</p>
            </Sidebar.Item>
          ))}
       
          <Sidebar.Item href="#" icon={HiInbox} label="3">
            <p>{i18next.t("courses")}</p>
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            <p>{i18next.t("topics")}</p>
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            <p>{i18next.t("library")}</p>
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            <p>{i18next.t("statistics")}</p>
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable}>
            <p>{i18next.t("feedback")}</p>
          </Sidebar.Item> 
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      <Sidebar.CTA className="admin-menu">
        <div className="mb-3 flex items-center">
          <Badge color="warning">
            <p>{i18next.t("beta")}</p>
          </Badge>
          <button
            aria-label="Close"
            className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-gray-100 p-1 text-cyan-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            type="button"
          ></button>
        </div>
        <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
          <p>{i18next.t("app_beta_note")}</p>
        </div>
        <a
          className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300"
          href="#"
        >
          <p>Got it !</p>
        </a>
      </Sidebar.CTA>
    </Sidebar>
  );
};

export default AdminSidebar;
