"use client";

import { Navbar } from "flowbite-react";
import i18next from "i18next";
import { FC } from "react";

import useAuth from "@hooks/useAuth";
import { observer } from "mobx-react-lite";
import AdminSidebar from "./sidebar";
import { TadminLayout } from "./types";
import AdminHeader from "./AdminHeader";
import useNavigation from "@hooks/useNavigation";
import { ADMIN_LINKS } from "./links";

const AdminLayout: FC<TadminLayout> = observer(
  ({ children, withBreadcrumb = true }) => {
    const { isAuthenticated, handleLogout } = useAuth();
    const { activeMenuItem } = useNavigation();

    return (
      <main className="">
        <Navbar className="nav-bar" fluid={true} rounded={true}>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Link
              style={{ color: "wheat" }}
              href="/navbars"
              active={true}
            >
              {i18next.t("home")}
            </Navbar.Link>
            <Navbar.Link className="navbar-menu-item" href="/navbars">
              {i18next.t("about_us")}
            </Navbar.Link>
            <Navbar.Link className="navbar-menu-item" href="/navbars">
              {i18next.t("resources")}
            </Navbar.Link>
            {!isAuthenticated ? (
              <Navbar.Link className="navbar-menu-item" href="/auth/signup">
                {i18next.t("login_signup")}
              </Navbar.Link>
            ) : (
              <Navbar.Link
                className="navbar-menu-item"
                onClick={handleLogout}
                href="#"
              >
                {i18next.t("logout")}
              </Navbar.Link>
            )}
          </Navbar.Collapse>
        </Navbar>

        <div className="grid grid-cols-5 grid-rows-5 gap-4">
          <div className="basis-1/12">
            <AdminSidebar />
          </div>

          <div className="col-span-4">
            {withBreadcrumb && (
              <AdminHeader
                menuItems={ADMIN_LINKS}
                targetLink={activeMenuItem?.link as string}
              />
            )}
            {children}
          </div>
        </div>
      </main>
    );
  }
);

export default AdminLayout;
