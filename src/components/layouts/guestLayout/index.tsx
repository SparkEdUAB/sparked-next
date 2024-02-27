"use client";

import AppLogo from "@components/logo";
import { Navbar } from "flowbite-react";
import { FC, ReactNode } from "react";
import i18next from "i18next";

import useAuth from "@hooks/useAuth";
import { ADMIN_LINKS } from "../adminLayout/links";

const GuestLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, handleLogout } = useAuth();



  const commonLinks = [
    <Navbar.Link key={"library"} className="navbar-menu-item" href="library">
      {i18next.t("library")}
    </Navbar.Link>,
  ];

  return (
    <main className="">
      <Navbar className="nav-bar" fluid={true} rounded={true}>
        <Navbar.Brand href="#">
          <AppLogo />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse
          style={{
            backgroundColor: "#0b100ce4",
            height: 100,
            marginTop: -8,
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Navbar.Link className="navbar-menu-item" href="/" active={true}>
            {i18next.t("home")}
          </Navbar.Link>
          {!isAuthenticated ? (
            <>
              <Navbar.Link className="navbar-menu-item" href="/auth/signup">
                {i18next.t("login_signup")}
              </Navbar.Link>
              {commonLinks}
            </>
          ) : (
            <>
              <Navbar.Link
                className="navbar-menu-item"
                href={ADMIN_LINKS.home.link}
              >
                {i18next.t("admin")}
              </Navbar.Link>
              <Navbar.Link
                className="navbar-menu-item"
                onClick={handleLogout}
                href="#"
              >
                {i18next.t("logout")}
              </Navbar.Link>
              {commonLinks}
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
      {children}
    </main>
  );
};

export default GuestLayout;
