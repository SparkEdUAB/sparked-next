'use client';

import React from 'react';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import HeaderSection from './HeaderSection';

// We should only show this if not logged in
const WelcomePage: React.FC = () => {
  return (
    <>
      <HeaderSection />
      <HeroSection />
      <FooterSection />
    </>
  );
};

export default WelcomePage;
