import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthConfig } from './context/AuthConfigContext';

export const RequireAuth = () => {
  const { user } = useAuthConfig();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};