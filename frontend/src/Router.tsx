import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const DefaultLayout = lazy(() => import("./components/layout/dafault"));
const HomePage = lazy(() => import("./pages/home"));
const EventsPage = lazy(() => import("./pages/events"));
const SingleEventPage = lazy(() => import("./pages/events/id"));

const AuthLayout = lazy(() => import("./components/layout/auth"));
const LoginPage = lazy(() => import("./pages/auth/login"));
const RegisterPage = lazy(() => import("./pages/auth/register"));

const DashboardLayout = lazy(() => import("./components/layout/dashboard"));
const DashboardPage = lazy(() => import("./pages/dashboard/index"));
const CustomerBookingsPage = lazy(() => import("./pages/dashboard/bookings"));

const AdminDashboardPage = lazy(() => import("./pages/admin"));
const AdminEventsPage = lazy(() => import("./pages/admin/events"));
const CreateEventPage = lazy(() => import("./pages/admin/events/new"));
const EditEventPage = lazy(() => import("./pages/admin/events/edit"));
const AdminBookingsPage = lazy(() => import("./pages/admin/bookings"));

export default function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<SingleEventPage />} />
        </Route>

        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={<DashboardLayout requiredRoles={["customer"]} />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="bookings" element={<CustomerBookingsPage />} />
        </Route>

        <Route
          path="/admin"
          element={<DashboardLayout requiredRoles={["admin"]} />}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="events/new" element={<CreateEventPage />} />
          <Route path="events/:id/edit" element={<EditEventPage />} />

          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
