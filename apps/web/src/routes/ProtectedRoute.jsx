import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenExpired } from "../utils/jwt";

export function ProtectedRoute({ requiredRole, children }) {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const roles = Array.isArray(auth.user?.roles) ? auth.user.roles : [];
  const hasExpiredToken = auth.accessToken ? isTokenExpired(auth.accessToken, 0) : false;

  if (!auth.isAuthenticated || !auth.user || hasExpiredToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname, reason: "unauthorized" }} />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ?? <Outlet />;
}
