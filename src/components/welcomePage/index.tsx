import FooterSection from './FooterSection';
import HeroSection from './HeroSection';
import HeaderSection from './HeaderSection';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 dark:bg-gray-900 dark:text-slate-100">
      <HeaderSection />
      <HeroSection />
      <FooterSection />
    </div>
  );
};

export default WelcomePage;
