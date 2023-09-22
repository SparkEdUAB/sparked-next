import Image from "next/image";

const AppLogo = () => (
  <div>
    <Image
      width={100}
      height={175}
      src="/logo.png"
      alt="SparkEd Logo"
      className="logo"
    />
  </div>
);

export default AppLogo;
