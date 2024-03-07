import Image from "next/image";

const AppLogo = () => (
    <Image
      width={300}
      height={60}
      src="/logo-blue.png"
      alt="SparkEd Logo"
      className="admin-logo"
    />
);

export default AppLogo;
