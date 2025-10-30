import { useAuth } from "./context/AuthContext.jsx";
import { useMembership } from "./context/MembershipContext.jsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute() {
  const { loading, user, isAuthenticated } = useAuth();
  const { activeMembership, getActiveMembership, loading: membershipLoading } = useMembership();
  const location = useLocation();
  const [checkedMembership, setCheckedMembership] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user?.isAdmin) {
      getActiveMembership().finally(() => setCheckedMembership(true));
    } else if (isAuthenticated && user?.isAdmin) {
      setCheckedMembership(true);
    }
  }, [isAuthenticated, user?.isAdmin]);

  // Mostrar loading mientras se verifica auth O mientras se verifica membresía
  if (loading || (isAuthenticated && !checkedMembership)) {
    return <h1>Loading...</h1>;
  }

  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;

  // Si es admin, permitir acceso a rutas de admin sin restricciones
  if (user?.isAdmin) {
    return <Outlet />;
  }

  // Para usuarios normales, verificar membresía solo en rutas que no sean /plans o /membership
  const allowedPathsWithoutMembership = ["/plans", "/membership", "/profile"];
  const isAllowedPath = allowedPathsWithoutMembership.some((path) =>
    location.pathname.startsWith(path)
  );

  // Si no tiene membresía activa y está tratando de acceder a otras rutas
  if (
    !isAllowedPath &&
    (!activeMembership || activeMembership.status !== "active")
  ) {
    return <Navigate to="/plans" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
