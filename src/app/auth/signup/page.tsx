"use client";

import Signup from "@components/auth/signup";
import GuestLayout from "@components/layouts/guestLayout";
import PortalLayout from "@components/layouts/portalLayout";
import React from "react";

const Home: React.FC = (props) => {
  return (
    <GuestLayout>
      <Signup />
    </GuestLayout>
  );
};

export default Home;
