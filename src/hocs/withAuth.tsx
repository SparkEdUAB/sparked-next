import useAuth from '@hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react';
import { routes } from 'routes';

function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    console.log('Authenticated:', isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push(routes.auth.login);
      }

      return () => {
        console.log('Cleaning up...');
      };
    }, [isAuthenticated]);

    return <Component {...props} />;
  };
}

export default withAuth;
