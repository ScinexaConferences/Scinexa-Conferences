import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { AboutPage } from "../pages/AboutPage";
import { AgendaPage } from "../pages/AgendaPage";
import { AbstractPage } from "../pages/AbstractPage";
import { BlogPage } from "../pages/BlogPage";
import { CommitteePage } from "../pages/CommitteePage";
import { ConferenceDetailsPage } from "../pages/ConferenceDetailsPage";
import { ConferencesPage } from "../pages/ConferencesPage";
import { ContactPage } from "../pages/ContactPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DownloadsPage } from "../pages/DownloadsPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RegisterPage } from "../pages/RegisterPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { SessionsPage } from "../pages/SessionsPage";
import { SpeakersPage } from "../pages/SpeakersPage";
import { SponsorPage } from "../pages/SponsorPage";
import { Dashboard as AdminDashboard } from "../pages/admin/Dashboard";
import { AgendaSectionEdit } from "../pages/admin/AgendaSectionEdit";
import { HeroSectionEdit } from "../pages/admin/HeroSectionEdit";
import { ManageCommittee } from "../pages/admin/ManageCommittee";
import { ManageDownloads } from "../pages/admin/ManageDownloads";
import { ManageRegistrations } from "../pages/admin/ManageRegistrations";
import { ManageSpeakers } from "../pages/admin/ManageSpeakers";
import { Settings as AdminSettings } from "../pages/admin/Settings";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "conferences", element: <ConferencesPage /> },
      { path: "conferences/:conferenceId", element: <ConferenceDetailsPage /> },
      { path: "abstract", element: <AbstractPage /> },
      { path: "sessions", element: <SessionsPage /> },
      { path: "speakers", element: <SpeakersPage /> },
      { path: "committee", element: <CommitteePage /> },
      { path: "downloads", element: <DownloadsPage /> },
      { path: "agenda", element: <AgendaPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "registration", element: <RegistrationPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "sponsors", element: <SponsorPage /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/settings" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "hero-section", element: <HeroSectionEdit /> },
          { path: "agenda-edit", element: <AgendaSectionEdit /> },
          { path: "manage-speakers", element: <ManageSpeakers /> },
          { path: "manage-committee", element: <ManageCommittee /> },
          { path: "manage-downloads", element: <ManageDownloads /> },
          { path: "manage-registrations", element: <ManageRegistrations /> }
        ]
      }
    ]
  }
]);
