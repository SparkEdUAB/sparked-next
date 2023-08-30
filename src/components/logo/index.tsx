
import Image from "next/image";


const AppLogo = () => (
  <Image
    width={75}
    height={75}
    src="/logo.png"
    className="mr-3 h-6 sm:h-9"
    alt="SparkEd Logo"
  />
);

export default AppLogo;