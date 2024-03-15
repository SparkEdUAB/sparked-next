import Image from 'next/image';

const AppLogo = ({ scale = 1 }: { scale?: number }) => {
  const defaultWidth = 160;
  const defaultHeight = 30;

  return (
    <Image
      width={defaultWidth * scale}
      height={defaultHeight * scale}
      src="/alternate-logo.svg"
      alt="SparkEd Logo"
      className="admin-logo"
    />
  );
};

export default AppLogo;
