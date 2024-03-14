import Image from 'next/image';

const AppLogo = ({ width, height }: { width?: number; height?: number }) => (
  <Image
    width={width || 160}
    height={height || 30}
    src="/alternate-logo.svg"
    alt="SparkEd Logo"
    className="admin-logo"
  />
);

export default AppLogo;
