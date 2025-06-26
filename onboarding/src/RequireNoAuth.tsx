import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthConfig } from './context/AuthConfigContext';

export const RequireNoAuth = () => {
  const { user } = useAuthConfig();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireNoAuth