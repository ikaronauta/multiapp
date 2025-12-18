// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

import { getUserFromToken, isRoleAllowed } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const user = getUserFromToken();

  if (!user) return <Navigate to="/login" replace />;

  if (!isRoleAllowed(allowedRoles, user.roleId)) {
    // Usuario con token pero sin rol permitido
    return <Navigate to="/" replace />; // o a página "No autorizado"
  }

  return children;
}
