import React, { useEffect } from 'react';
import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import HeaderSection from './HeaderSection';
import { IBM_Plex_Sans } from 'next/font/google';

const ibmBlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// We should only show this if not logged in
const WelcomePage: React.FC = () => {
  return (
    <>
      <div className={`${ibmBlexSans.className} text-[#36799d] dark:text-[#98bdd2]`}>
        <HeaderSection />
        <HeroSection />
        <FooterSection />
      </div>
    </>
  );
};

export default WelcomePage;
