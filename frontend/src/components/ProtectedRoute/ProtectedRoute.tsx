import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  return <Outlet />;
}
