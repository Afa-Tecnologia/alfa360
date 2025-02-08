import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (Component: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.push('/login');
      }
    }, [token, router]);

    if (!token) return null;

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
