import { Navigate, Outlet } from "react-router";
// Composant ProtectedRoute pour protéger les routes accessibles uniquement aux utilisateurs authentifiés
export default function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  return <Outlet />;
}
