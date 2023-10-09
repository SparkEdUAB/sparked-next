"use client";

import Login from "@components/auth/login";
import GuestLayout from "@components/layouts/guestLayout";
import React from "react";

const Home: React.FC = (props) => {
  return (
    <GuestLayout>
      <Login />
    </GuestLayout>
  );
};

export default Home;
