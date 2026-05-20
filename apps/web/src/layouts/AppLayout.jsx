import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useAuthSession } from "../hooks/useAuthSession";

export function AppLayout() {
  const theme = useSelector((state) => state.ui.theme);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useAuthSession();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen">
      {isAdminRoute ? null : <Navbar />}
      <main>
        <Outlet />
      </main>
      {isAdminRoute ? null : <Footer />}
    </div>
  );
}
