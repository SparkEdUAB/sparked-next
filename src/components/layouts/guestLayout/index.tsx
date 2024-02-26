// src/components/Header.jsx
import React from "react";
import { Row, Col, Menu } from "antd";
import Link from "next/link";
// import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-800">
      <Row>
        <Col span={24}>
          <div className="container mx-auhref px-4 py-2 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Flowbite
            </Link>
            <Menu mode="horizontal">
              <Menu.Item key="home">
                <Link href="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="company">
                <Link href="/company">Company</Link>
              </Menu.Item>
              <Menu.Item key="marketplace">
                <Link href="/marketplace">Marketplace</Link>
              </Menu.Item>
              <Menu.Item key="features">
                <Link href="/features">Features</Link>
              </Menu.Item>
              <Menu.Item key="team">
                <Link href="/team">Team</Link>
              </Menu.Item>
              <Menu.Item key="contact">
                <Link href="/contact">Contact</Link>
              </Menu.Item>
              <Menu.Item key="login">
                <Link href="/login">Log in</Link>
              </Menu.Item>
              <Menu.Item key="get-started">
                <Link href="/get-started">Get started</Link>
              </Menu.Item>
            </Menu>
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
