import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const DefaultLayout = lazy(() => import("./components/layout/dafault"));
const HomePage = lazy(() => import("./pages/home"));
const EventsPage = lazy(() => import("./pages/events"));
const SingleEventPage = lazy(() => import("./pages/events/id"));

const AuthLayout = lazy(() => import("./components/layout/auth"));
const LoginPage = lazy(() => import("./pages/auth/login"));

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
        </Route>
      </Routes>
    </Suspense>
  );
}
