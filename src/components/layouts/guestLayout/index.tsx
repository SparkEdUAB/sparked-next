import {  ReactNode,FC} from "react";
import { Navbar } from "flowbite-react";
import AppLogo from "@/components/logo";


const GuestLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="#">
          <AppLogo />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            SparkEd
          </span>
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

export default GuestLayout;