import {  ReactNode,FC} from "react";

const GuestLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <main>
    {children}</main>;
};

export default GuestLayout;