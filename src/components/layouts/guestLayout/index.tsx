"use client";

import AppLogo from "@components/logo";
import { Navbar } from "flowbite-react";
import { FC, ReactNode } from "react";

import useAuth from "@hooks/useAuth";

const GuestLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="">
      <Navbar className="nav-bar " fluid={true} rounded={true}>
        <Navbar.Brand href="#">
          <AppLogo />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link href="/navbars" active={true}>
            Home
          </Navbar.Link>
          <Navbar.Link href="/navbars">About</Navbar.Link>
          <Navbar.Link href="/navbars">Resources</Navbar.Link>
          {!isAuthenticated && <Navbar.Link href="/navbars">Login</Navbar.Link>}
        </Navbar.Collapse>
      </Navbar>
      {children}
    </main>
  );
};

export default GuestLayout;
