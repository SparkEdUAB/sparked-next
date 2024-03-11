'use client';

import React from 'react';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import HeaderSection from './HeaderSection';
import Head from 'next/head';

// We should only show this if not logged in
const WelcomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>SparkEd</title>
      </Head>
      <HeaderSection />
      <HeroSection />
      <FooterSection />
    </>
  );
};

export default WelcomePage;
