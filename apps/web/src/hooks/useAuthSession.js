import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { getTokenRemainingMs, isTokenExpired } from "../utils/jwt";

export function useAuthSession() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return undefined;
    }

    const handleExpiry = () => {
      dispatch(logout());

      if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard")) {
        navigate("/login", {
          replace: true,
          state: { reason: "expired", from: location.pathname }
        });
      }
    };

    if (isTokenExpired(accessToken)) {
      handleExpiry();
      return undefined;
    }

    const remainingMs = getTokenRemainingMs(accessToken);

    if (!remainingMs) {
      return undefined;
    }

    const timeoutId = window.setTimeout(handleExpiry, Math.max(remainingMs, 0));

    return () => window.clearTimeout(timeoutId);
  }, [accessToken, dispatch, isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    const handleForcedExpiry = () => {
      dispatch(logout());

      if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard")) {
        navigate("/login", {
          replace: true,
          state: { reason: "expired", from: location.pathname }
        });
      }
    };

    window.addEventListener("scinexa:auth-expired", handleForcedExpiry);

    return () => {
      window.removeEventListener("scinexa:auth-expired", handleForcedExpiry);
    };
  }, [dispatch, location.pathname, navigate]);
}
