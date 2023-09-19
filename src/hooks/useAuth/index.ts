import { useSession } from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";

  return {
    isAuthenticated,
  };
};

export default useAuth;