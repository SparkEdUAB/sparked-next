import Image from "next/image";

const AppLogo = () => (
  <div >
    <Image
      width={80}
      height={160}
      src="/logo.png"
      alt="SparkEd Logo"
      className="logo"
    />
  </div>
);

export default AppLogo;
