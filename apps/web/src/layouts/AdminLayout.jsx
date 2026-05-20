import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AdminSidebar } from "../components/sidebar/AdminSidebar";
import { AdminNavbar } from "../components/navbar/AdminNavbar";
import { ConfirmLogoutModal } from "../components/modals/ConfirmLogoutModal";
import { logout } from "../store";
import { logoutAdminSession } from "../services/authService";

export function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      await logoutAdminSession();
    } finally {
      dispatch(logout());
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      setIsMobileSidebarOpen(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,255,0.12),transparent_20%),radial-gradient(circle_at_top_right,rgba(47,182,255,0.14),transparent_20%),linear-gradient(180deg,#f6f7fb,#f4f0ff_46%,#eef4ff)] dark:bg-[radial-gradient(circle_at_top_left,rgba(98,63,176,0.24),transparent_18%),radial-gradient(circle_at_top_right,rgba(47,182,255,0.18),transparent_20%),linear-gradient(180deg,#09111f,#0d1528_48%,#101930)]">
      <div className="flex min-h-screen items-start">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCollapseToggle={() => setIsSidebarCollapsed((current) => !current)}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col self-stretch">
          <AdminNavbar
            onMenuToggle={() => setIsMobileSidebarOpen(true)}
            onCollapseToggle={() => setIsSidebarCollapsed((current) => !current)}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>

      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        isSubmitting={isLoggingOut}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
