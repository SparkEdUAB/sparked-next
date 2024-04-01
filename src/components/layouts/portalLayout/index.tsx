'use client';

import { ReactNode, FC } from 'react';
import { Navbar } from 'flowbite-react';
import AppLogo from '@components/logo';

const PortalLayout: FC<{ children: ReactNode }> = ({ children }) => {
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
          <Navbar.Link href="/navbars">Services</Navbar.Link>
          <Navbar.Link href="/navbars">Pricing</Navbar.Link>
          <Navbar.Link href="/navbars">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      {children}
    </main>
  );
};

export default PortalLayout;
